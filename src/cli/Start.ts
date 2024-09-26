import { StartGlobalBroker } from "../Configure.ts"

export const Start = {
  command: "start",
  aliases: "s",
  describe: "Start the Atomstack application",
  async handler(argv: { root: string }) {
    try {
      await StartGlobalBroker(argv.root, {})
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
}
