import * as yargs from "yargs";
import { Generate } from "./Generate.ts";
import { globSync } from "glob";
import Path from "path";
import { describe, jest, beforeEach, it, expect } from "@jest/globals";

jest.mock("glob");
jest.mock("path");
jest.mock("yargs", () => ({
  command: jest.fn(),
  demandCommand: jest.fn().mockReturnThis(),
  help: jest.fn().mockReturnThis(),
}));
jest.mock("../Configure.ts")

describe("Generate Command", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should define the command correctly", () => {
    expect(Generate.command).toBe("generate");
    expect(Generate.aliases).toBe("g");
    expect(Generate.describe).toBe("Use an Atomstack generator");
  });

  it("should build the yargs commands correctly", () => {
    const mockYargs = require("yargs");
    const mockFiles = [
      "/path/to/generators/file1.ts",
      "/path/to/generators/file2.ts",
    ];

    (globSync as jest.Mock).mockReturnValue(mockFiles);
    (Path.join as jest.Mock).mockReturnValue("/path/to/generators/**/*.ts");

    const mockGenerator = { default: jest.fn() };
    jest.mock("/path/to/generators/file1.ts", () => mockGenerator, { virtual: true });
    jest.mock("/path/to/generators/file2.ts", () => mockGenerator, { virtual: true });

    (Generate.builder! as (args: yargs.Argv<{}>) => yargs.Argv<{}>)(mockYargs);

    expect(globSync).toHaveBeenCalledWith("/path/to/generators/**/*.ts");
    expect(mockYargs.command).toHaveBeenCalledWith(mockGenerator.default);
    expect(mockYargs.demandCommand).toHaveBeenCalled();
    expect(mockYargs.help).toHaveBeenCalled();
  });

  it("should have a no-op handler", () => {
    expect(Generate.handler).toBeInstanceOf(Function);
    expect(Generate.handler({} as yargs.ArgumentsCamelCase<{}>)).toBeUndefined();
  });

});
