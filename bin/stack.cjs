#!/usr/bin/env node

/**
 * This must be a `cjs` file as SWC register isn't designed to be loaded as a module.
*/
const { register } = require("@swc-node/register/register")
const yargs = require("yargs")
const Path = require("path")
const { hideBin } = require("yargs/helpers")
const { globSync } = require("glob")
const { ServiceBroker } = require("moleculer")
const fs = require("fs")

register(() => {
})

require("../src/boot.ts").default()

const { DB } = require("../src/cli/DB.ts")

yargs(hideBin(process.argv))
  .scriptName("stack")
  .option("e", {
    alias: "env",
    default: "development"
  })
  .middleware((argv) => {
    if (argv.e) {
      process.env.NODE_ENV = argv.e
    }
    process.env.NODE_ENV = process.env.NODE_ENV || "development"
    console.log(`Executing in '${process.env.NODE_ENV}' mode`)
  })
  .command({
    command: "generate",
    aliases: "g",
    description: "Use an Atomstack generator",
    builder: (yargs) => {
      const files = globSync(Path.join(atomstackDir, "generators", "**", "*.ts"))
      // import each file and call yargs command with the file content
      for (const file of files) {
        if (!file.includes("actions")) {
          const generator = require(file)
          yargs.command(generator.default).demandCommand().help()
        }
      }
    }
  })
  .command({
    command: "start",
    aliases: "s",
    description: "Start the Atomstack application",
    handler: () => {
      const configPath = Path.join(process.env.ATOMSTACK_ROOT, "config", "stack.config.ts")

      if (!fs.existsSync(configPath)) {
        console.error(`Config file not found at ${configPath}`)
        process.exit(1)
      }


      const config = require(Path.join(process.env.ATOMSTACK_ROOT, "config", "stack.config.ts")).default

      if (process.env.NODE_ENV === "development") {
        config.hotReload = true
      }

      global.broker = new ServiceBroker(config)
      broker.start()
    }
  })
  .command({
    command: "console",
    aliases: "c",
    describe: "Start the Moleculer REPL console",
    handler: () => {
      const config = require(Path.join(process.env.ATOMSTACK_ROOT, "config", "stack.config.ts")).default
      config.logger = false
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

