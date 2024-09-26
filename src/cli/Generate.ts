import { CommandModule } from "yargs";
import { globSync } from "glob";
import Path from "path";

export const Generate: CommandModule = {
  command: "generate",
  aliases: "g",
  describe: "Use an Atomstack generator",
  builder: (yargs,) => {
    const files = globSync(Path.join(Path.resolve(__dirname, ".."), "generators", "**", "*.ts"))
    // import each file and call yargs command with the file content
    for (const file of files) {
      if (!file.includes("actions")) {
        const generator = require(file)
        yargs.command(generator.default)
      }
    }
    return yargs.demandCommand().help()
  },
  handler: () => {
  }
}
