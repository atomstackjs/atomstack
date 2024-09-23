import {Argv, CommandModule} from "yargs";
import {Dev} from "./migrate/Dev.ts";

export const Migrate: CommandModule = {
  command: "migrate",
  builder: (yargs: Argv) => yargs.command(Dev as CommandModule),
  handler: () => {}
}
