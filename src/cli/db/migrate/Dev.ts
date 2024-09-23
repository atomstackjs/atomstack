import {Argv, CommandModule} from "yargs";
import Path from "path";
import {globSync} from "glob";
import {spawnSync} from "child_process";
import fs from "fs";
import {say, setTemplateDir, template} from "../../../generators/actions.ts";
import {camelCase, kebabCase, snakeCase} from "lodash";


interface Options {
  "db-service-dir": string;
  "service-name-prefix"?: string;
  "atomstack-module"?: string;
  "mixin": string;
}

interface MigrateArgs{
  dbServiceDir: string;
  serviceNamePrefix?: string;
  atomstackModule?: string;
  mixin: string;
}

export const Dev: CommandModule<Options, MigrateArgs> = {
  command: "dev",
  describe: "Run all migrations for all services, including Atomstack internal migrations. " +
    "This will fail if `NODE_ENV` is not set to `development`",
  builder(yargs: Argv) {
    return yargs
      .option("db-service-dir", {
        description: "The directory where the db services are located",
        default: Path.join(process.env.ATOMSTACK_ROOT!, "services", "db")
      })
      .option("service-name-prefix", {
        description: "The prefix to use for the service name",
      })
      .options("atomstack-module", {
        description: "The directory where the Atomstack library is located",
        default: "@atomstack/core"
      })
      .option("mixin", {
        description: "The mixin to use for the service",
        default: "DB"
      }) as unknown as Argv<MigrateArgs>;
  },
  handler: async (args: MigrateArgs) => {
    if (!["test", "development"].includes(process.env.NODE_ENV!)) {
      console.error("This command can only be run in development mode");
      process.exit(1);
    }

    await say(`Running migrations for all services in ${args.dbServiceDir}`);

    const internalSchema = globSync(Path.join(args.dbServiceDir!, "**(!client)**", "schema.prisma"));

    for (const file of internalSchema) {
      await say(`Running migrations for ${file}`);

      const result = spawnSync("yarn", ["prisma", "migrate", "dev", "--schema", file], {stdio: "inherit"});

      if (result.status !== 0) {
        console.error("Failed to run migrations", result);
        process.exit(1);
      }

      const content = fs.readFileSync(file, "utf-8");
      const models = content.match(/model (\w+) {/g)?.map((m) => m.replace("model ", "").replace(" {", "")) || [];

      await setTemplateDir(Path.resolve(process.env.ATOMSTACK_SRC!, "generators/templates/db_service"));
      for (const model of models) {


        const serviceNameParts = ["db", kebabCase(model)];
        if (args.serviceNamePrefix) {
          serviceNameParts.unshift(args.serviceNamePrefix);
        }
        const serviceName = serviceNameParts.join(".")

        const snakeCaseName = snakeCase(model);
        const kebabCaseName = kebabCase(model);
        const camelCaseName = camelCase(model);

        await template("db-service.ts", Path.resolve(file, "../../", `${kebabCaseName}.service.ts`), {
          serviceName,
          snakeCaseName,
          kebabCaseName,
          camelCaseName,
          atomstackModule: args.atomstackModule!,
          mixin: args.mixin,
          name: model
        });
      }
    }
  }
}