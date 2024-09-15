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
const { spawnSync } = require("child_process")

register(() => { })

require("../src/boot.ts").default()


// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .scriptName("stack")
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
    description: "Start the Moleculer REPL console",
    handler: () => {
      const config = require(Path.join(process.env.ATOMSTACK_ROOT, "config", "stack.config.ts")).default
      config.logger = false
      config.metadata = { ...config.metadata || {}, repl: true }
      const broker = new ServiceBroker(config)
      broker.start()
      broker.repl()
    }
  })
  .command({
    command: "db",
    description: "Database commands",
    builder: (yargs) => {
      yargs.command({
        command: "migrate",
        description: "Migration commands",
        builder: (yargs) => {
          yargs.command({
            command: "dev",
            description: "Run all migrations for all services, including Atomstack internal migrations. " +
              "This will fail if `NODE_ENV` is not set to `development`",
            handler: async () => {
              if (process.env.NODE_ENV !== "development") {
                console.error("This command can only be run in development mode")
                process.exit(1)
              }

              const internalSchema = globSync(Path.join(atomstackDir, "services", "db", "**", "schema.prisma"))

              for (const file of internalSchema) {
                const result = spawnSync("yarn", ["prisma", "migrate", "dev", "--schema", file], { stdio: "inherit" })

                if (result.status !== 0) {
                  console.error("Failed to run migrations", result)
                  process.exit(1)
                }
              }
            }
          }).demandCommand().help()
        }
      }).demandCommand().help()
    },
  })
  .demandCommand()
  .help()
  .argv

