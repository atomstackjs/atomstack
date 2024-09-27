import { StartGlobalBroker } from "../Configure.ts"

export const Console = {
  command: "console",
  aliases: "c",
  describe: "Start the Moleculer REPL console",
  handler: async (args: { root: string }) => {
    await StartGlobalBroker(args.root, {
      metadata: {
        repl: true
      },
      logger: false
    })

    broker.repl()
  }
}
