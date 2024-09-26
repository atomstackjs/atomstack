import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import Path from "path";


export default function() {
  process.env.NODE_ENV = process.env.NODE_ENV || "development"
  process.env.ATOMSTACK_SRC = Path.resolve(__dirname, "..", "src")
  process.env.ATOMSTACK_ROOT ||= process.cwd()

  dotenvExpand.expand(dotenv.config({
    path: [
      `${process.env.ATOMSTACK_ROOT}/config/env.local`,
      `${process.env.ATOMSTACK_ROOT}/config/env.${process.env.NODE_ENV}`,
    ],
    debug: process.env.NODE_ENV === "development"
  }))
}
