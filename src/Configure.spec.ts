import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Middleware as ChannelsMiddleware } from "@moleculer/channels";
import AtomstackMiddleware from "./Middlewares/AtomstackMiddleware.ts"
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { defaultsDeep } from "lodash";
import { Configure } from "./Configure.ts";
import { EncryptionMiddleware } from "./Middlewares/EncryptionMiddleware.ts";
import { TransporterConfig } from "moleculer";
import { OmniValidator } from "./ServiceValidators/OmniValidator.ts";

jest.mock("dotenv");
jest.mock("dotenv-expand");
jest.mock("lodash", () => ({
  defaultsDeep: jest.fn(),
}));

jest.mock("./Middlewares/EncryptionMiddleware.ts")
jest.mock("@moleculer/channels");

describe("Configure", () => {
  const DEFAULTS = {
    logger: false,
    namespace: "test",
  };

  const mockConfig = {
    transporter: "fake" as TransporterConfig["type"]
  };

  beforeEach(() => {
    process.env = {};
    (dotenv.config as jest.Mock).mockReturnValue({ parsed: { SOME_ENV_VAR: "value" } });
    (dotenvExpand.expand as jest.Mock).mockImplementation((config) => config);
    (defaultsDeep as jest.Mock).mockReturnValue({ ...mockConfig, ...DEFAULTS });
    (ChannelsMiddleware as jest.Mock).mockReturnValue("ChannelsMiddleware");
  });

  it("should set NODE_ENV to \"development\" if not already set", () => {
    Configure(mockConfig);
    expect(process.env.NODE_ENV).toBe("development");
  });

  it("should load environment variables", () => {
    process.env.ATOMSTACK_ROOT = "/path/to/root";
    Configure(mockConfig);
    expect(dotenv.config).toHaveBeenCalledWith({
      path: [
        "/path/to/root/config/env.local",
        "/path/to/root/config/env.development",
      ],
    });
    expect(dotenvExpand.expand).toHaveBeenCalled();
  });

  it("should return the expected configuration object", () => {
    process.env.ATOMSTACK_ROOT = "/path/to/root";
    process.env.ATOMSTACK_CHANNEL_ADAPTER = "someAdapter";
    const result = Configure(mockConfig);
    expect(result).toEqual({
      ...mockConfig,
      ...DEFAULTS,
      middlewares: [
        "ChannelsMiddleware",
        EncryptionMiddleware,
        AtomstackMiddleware,
      ],
      validator: expect.any(OmniValidator),
    });
    expect(ChannelsMiddleware).toHaveBeenCalledWith({
      adapter: "someAdapter",
      sendMethodName: "sendToChannel",
      adapterPropertyName: "channelsAdapter",
      schemaProperty: "channels",
      context: true,
      channelHandlerTrigger: null,
    });
  });
});
