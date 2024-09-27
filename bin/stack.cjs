#!/usr/bin/env node

/**
 * This must be a `cjs` file as SWC register isn't designed to be loaded as a module.
*/
const yargs = require("yargs")
const { hideBin } = require("yargs/helpers")
const { register } = require("@swc-node/register/register")

register(() => { })

const { DB } = require("../src/cli/DB.ts")
const { Generate } = require("../src/cli/Generate.ts")
const { Start } = require("../src/cli/Start.ts")
const { Console } = require("../src/cli/Console.ts")


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
  .command(Start)
  .command(Console)
  .command(DB)
  .demandCommand()
  .help()
  .argv

