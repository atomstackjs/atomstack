import {Migrate} from "./db/Migrate.ts";
import {Argv, CommandModule} from "yargs";

export const DB: CommandModule = {
  command: "db",
  describe: "Database operations",
  builder: (yargs: Argv) => yargs.command(Migrate),
  handler: () => {}
}