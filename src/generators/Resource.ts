import { Argv, CommandModule } from "yargs";
import { createDirectory, say, setTemplateDir, template, yarnRun } from "./actions.ts";
import { camelCase, capitalize } from "lodash";
import { CreateConfiguration } from "../Configure.ts";

interface ResourceArgs {
  root: string;
  name: string;
  provider: string;
}

const Resource: CommandModule<ResourceArgs, ResourceArgs> = {
  command: "resource <name>",
  describe: "Generates a new resource",
  builder: (yargs: Argv) => {
    return yargs
      .positional("name", {
        description: "The name of the resource",
        type: "string"
      })
      .option("provider", {
        alias: "p",
        description: "The provider to use",
        default: "postgresql",
      }) as Argv<ResourceArgs>;
  },
  async handler(args: ResourceArgs) {
    CreateConfiguration(args.root, {})

    await setTemplateDir("resource");

    await say(`Generating resource ${args.name}`);
    await createDirectory(`services/db/${args.name}/prisma`);
    await template("schema.prisma", `services/db/${args.name}/prisma/schema.prisma`, {
      name: args.name,
      provider: args.provider,
      modelName: capitalize(camelCase(args.name))
    });
    await yarnRun("stack db migrate dev");
  }
}

export default Resource;
