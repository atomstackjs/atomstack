import { last } from "lodash";
import Path from "path";
import { Argv } from "yargs";
import { createDirectory, executeCommand, fail, hasFile, say, setTemplateDir, template, yarnAdd } from "./actions.ts";

interface InitArgs {
  withLocalAtomstack: string
}

export default {
  command: "init",
  description: "Iniitaalizes a directory as a Atomstack application",
  builder: (yargs: Argv) => {
    yargs.option("withLocalAtomstack", {
      description: "Links the provided Atomstack library directory (for development purposes only)",
      type: "string"
    })
  },
  handler: async (args: InitArgs) => {
    if (await hasFile("package.json")) {
      await fail("This generator is only available from outside an existing library or application.")
    }

    const appName = last(process.env.ATOMSTACK_ROOT!.split("/"))

    await setTemplateDir("init")

    await say("Genrating new Atomstack application")
    await template("dotyarnrc.yml", ".yarnrc.yml", { appName: appName! })
    await executeCommand("yarn init")


    if (args.withLocalAtomstack) {
      const atomstackDir = Path.resolve(args.withLocalAtomstack)
      executeCommand(`yarn link ${atomstackDir}`)
    }

    await yarnAdd([
      "typescript",
      "eslint",
      "typescript-eslint",
      "ts-jest",
      "jest-cli",
      "jest",
      "globals",
      "eslint-plugin-react",
      "babel-jest",
      "@jest/globals",
      "@babel/preset-env",
      "@eslint/js"
    ], true)
    await template("tsconfig.json", "tsconfig.json")
    await template("eslint.config.js", "eslint.config.js")
    await createDirectory("config")
    await template("env.development", "config/env.development", { appName: appName! })
    await template("env.local.sample", "config/env.local.sample")
  }
}
