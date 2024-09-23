import pc from "picocolors"
import Path from "path"
import fs from "fs"
import { execSync, spawnSync } from "child_process"

const COLORS = {
  error: (message: string) => pc.bold(pc.red(message)),
  info: (message: string) => pc.bold(pc.blue(message)),
  success: (message: string) => pc.bold(pc.green(message))
}

export async function say(message: string, type: keyof typeof COLORS = "info") {
  console.log(COLORS[type](message))
}

export async function hasFile(file: string, dir: string = process.env.ATOMSTACK_ROOT!) {
  return fs.existsSync(Path.resolve(dir, file))
}

export async function fail(message: string) {
  await say(message, "error")
  process.exit(1)
}

export async function createDirectory(dir: string, cwd: string = process.env.ATOMSTACK_ROOT!) {
  say(`Creating directory '${dir}'`)
  if (!fs.existsSync(Path.resolve(cwd, dir))) {
    fs.mkdirSync(Path.resolve(cwd, dir))
  }
}

export async function setTemplateDir(dir: string) {
  process.env.TEMPLATE_DIR = Path.resolve(process.env.ATOMSTACK_SRC!, "generators", "templates", dir)
}

export async function setRootDir(dir: string) {
  process.env.ATOMSTACK_ROOT = Path.resolve(dir)
  process.chdir(dir)
}

export async function chDir(dir: string, base: string = process.env.ATOMSTACK_ROOT!) {
  say(`Changing working directory to '${dir}'`)
  await setRootDir(Path.resolve(base, dir))
}

export async function template(name: string, destination: string, data: Record<string, string> = {}) {
  say(`Copying template '${name}' to '${destination}'`)
  const templatePath = Path.resolve(getTemplateDir(), `${name}.hbs`)

  if (!fs.existsSync(templatePath)) {
    await fail(`Template '${name}' does not exist at '${templatePath}'`)
  }

  const file = fs.readFileSync(templatePath, "utf-8")
  const template = file.toString()
  const compiled = template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => data[key])
  fs.writeFileSync(Path.resolve(process.env.ATOMSTACK_ROOT!, destination), compiled)
}

function getTemplateDir() {
  return process.env.TEMPLATE_DIR || Path.resolve(process.env.ATOMSTACK_SRC!, "generators", "templates")
}

export async function executeCommand(command: string) {
  say(`Executing command: ${command}`)
  const [cmd, ...args] = command.split(" ")
  const result = spawnSync(cmd, args, { stdio: "inherit" })
  if (result.error) {
    throw result.error
  }
}

export async function yarnAdd(packageNames: string[], dev: boolean = false) {
  const cmd = dev ? "yarn add -D" : "yarn add"
  await executeCommand(`${cmd} ${packageNames.join(" ")}`)
}

export async function addGitKeep(dir: string) {
  createDirectory(dir)
  fs.writeFileSync(Path.resolve(dir, ".gitkeep"), "")
}

export async function rmFile(file: string, silent: boolean = false) {
  if (!silent) {
    await say(`Removing file '${file}'`)
  }

  if (fs.existsSync(Path.resolve(process.env.ATOMSTACK_ROOT!, file))) {
    fs.rmSync(Path.resolve(process.env.ATOMSTACK_ROOT!, file))
  }
}

export async function rmDir(dir: string, silent: boolean = false) {
  if (!silent) {
    await say(`Removing directory '${dir}'`)
  }

  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true })
  }
}