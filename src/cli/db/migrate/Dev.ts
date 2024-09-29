import { Argv, CommandModule } from "yargs";
import Path from "path";
import { globSync } from "glob";
import { spawnSync } from "child_process";
import fs from "fs";
import { say, setTemplateDir, template } from "../../../generators/actions.ts";
import { camelCase, kebabCase, snakeCase } from "lodash";
import { CreateConfiguration } from "../../../Configure.ts";


interface Options {
  "db-service-dir": string;
  "service-name-prefix"?: string;
  "atomstack-module"?: string;
}

interface MigrateArgs {
  root: string;
  dbServiceDir: string;
  serviceNamePrefix?: string;
  atomstackModule?: string;
  mixin?: string;
}

export const Dev: CommandModule<Options, MigrateArgs> = {
  command: "dev",
  describe: "Run all migrations for all services, including Atomstack internal migrations. " +
    "This will fail if `NODE_ENV` is not set to `development`",
  builder(yargs: Argv) {
    return yargs
      .option("db-service-dir", {
        description: "The directory where the db services are located"
      })
      .options("atomstack-module", {
        description: "The directory where the Atomstack library is located",
        default: "@atomstack/core"
      })
      .option("mixin", {
        description: "The mixin to use for the service",
        default: "Mixins.DB.Base"
      }) as unknown as Argv<MigrateArgs>;
  },
  handler: async (args: MigrateArgs) => {
    if (!["test", "development"].includes(process.env.NODE_ENV!)) {
      console.error("This command can only be run in development mode");
      process.exit(1);
    }

    await CreateConfiguration(args.root, {})

    args.dbServiceDir ||= Path.resolve(process.env.ATOMSTACK_ROOT!, "services/db");

    await say(`Running migrations for all services in ${args.dbServiceDir}`);

    const internalSchema = globSync(Path.join(args.dbServiceDir!, "**", "schema.prisma"));
    const baseName = process.env.DATABASE_URL

    for (const file of internalSchema) {
      if (file.includes("/_client_/")) {
        continue;
      }

      process.env.DATABASE_URL = baseName + "_" + Path.basename(Path.resolve(Path.dirname(file), ".."))

      const url = new URL(process.env.DATABASE_URL);
      await say(`Running migrations for ${file} on ${url.host}${url.pathname}`);


      const result = spawnSync("yarn", ["prisma", "migrate", "dev", "--schema", file], { stdio: "inherit" });

      await setTemplateDir(Path.resolve(process.env.ATOMSTACK_SRC!, "generators/templates/db_service"));

      if (!fs.existsSync(Path.resolve(file, "../../", "prisma.mixin,ts"))) {
        template("prisma.mixin.ts", Path.resolve(file, "../../", "prisma.mixin.ts"), {
          mixin: args.mixin!
        })
      }

      process.env.DATABASE_URL = baseName;

      if (result.status !== 0) {
        console.error("Failed to run migrations", result);
        process.exit(1);
      }

      const content = fs.readFileSync(file, "utf-8");
      const models = content.match(/model (\w+) {/g)?.map((m) => m.replace("model ", "").replace(" {", "")) || [];

      for (const model of models) {

        const serviceNameParts = ["db", kebabCase(model)];
        if (args.serviceNamePrefix) {
          serviceNameParts.unshift(args.serviceNamePrefix);
        }
        const serviceName = serviceNameParts.join(".")

        const snakeCaseName = snakeCase(model);
        const kebabCaseName = kebabCase(model);
        const camelCaseName = camelCase(model);

        if (!fs.existsSync(Path.resolve(file, "../../", `${kebabCaseName}.service.ts`))) {
          await say(`Generating service for ${model}`);
          await template("db-service.ts", Path.resolve(file, "../../", `${kebabCaseName}.service.ts`), {
            serviceName,
            snakeCaseName,
            kebabCaseName,
            camelCaseName,
            atomstackModule: args.atomstackModule!,
            name: model,
          });
        }
      }
    }
  }
}
