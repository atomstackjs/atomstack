#!/usr/bin/env node

/**
 * This must be a `cjs` file as SWC register isn't designed to be loaded as a module.
*/
const yargs = require("yargs")
const Path = require("path")
const { hideBin } = require("yargs/helpers")
const { ServiceBroker } = require("moleculer")
const { register } = require("@swc-node/register/register")

register(() => { })

const { DB } = require("../src/cli/DB.ts")
const { Generate } = require("../src/cli/Generate.ts")
const { StartGlobalBroker } = require("../src/Configure.ts");

yargs(hideBin(process.argv))
  .scriptName("stack")
  .option("e", {
    alias: "env",
    default: "development"
  })
  .option("r", {
    alias: "root",
    default: process.cwd()
  })
  .middleware((argv) => {
    if (argv.e) {
      process.env.NODE_ENV = argv.e
    }
    process.env.NODE_ENV = process.env.NODE_ENV || "development"
    console.log(`Executing in '${process.env.NODE_ENV}' mode`)
  })
  .command(Generate)
  .command({
    command: "start",
    aliases: "s",
    describe: "Start the Atomstack application",
    async handler(argv) {
      try {
        await StartGlobalBroker(argv.root)
      } catch (error) {
        console.error(error)
        process.exit(1)
      }
    }
  })
  .command({
    command: "console",
    aliases: "c",
    describe: "Start the Moleculer REPL console",
    handler: () => {
      const config = require(Path.join(process.env.ATOMSTACK_ROOT, "config", "stack.config.ts")).default
      config.log_level = "debug"
      config.metadata = { ...config.metadata || {}, repl: true }
      const broker = new ServiceBroker(config)
      broker.start()
      broker.repl()
    }
  })
  .command(DB)
  .demandCommand()
  .help()
  .argv

