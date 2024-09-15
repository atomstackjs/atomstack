import { Middleware as ChannelsMiddleware } from "@moleculer/channels";
import { defaultsDeep } from "lodash";
import { BrokerOptions, Errors, LogLevels, TransporterConfig } from "moleculer";
import { EncryptionMiddleware } from "./Middlewares/EncryptionMiddleware.ts";
import { OmniValidator } from "./ServiceValidators/OmniValidator.ts";
import AtomstackMiddlware from "./Middlewares/AtomstackMiddlware.ts";

const DEFAULTS: BrokerOptions = {
  logLevel: process.env.ATOMSTACK_LOG_LEVEL as LogLevels || "debug",
  namespace: process.env.NODE_ENV || "development",
  retryPolicy: {
    enabled: true,
    retries: 10,
    delay: 300,
    maxDelay: 15000,
    factor: 2,
    check: err => err && (err as Errors.MoleculerError).retryable
  },
  transporter: process.env.ATOMSTACK_TRANSPORTER as TransporterConfig["type"] || "Redis",
}

/**
 * Configures the application with the provided broker options.
 *
 * This function sets up the environment, loads environment variables from
 * configuration files, and merges the provided broker options with default
 * settings. It also adds middlewares and a validator to the broker options.
 *
 * @param {BrokerOptions} config - The broker options to configure.
 * @returns {BrokerOptions} The final broker options with defaults and additional settings.
 */
export function Configure(config: BrokerOptions): BrokerOptions {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("./boot.ts").default()


  const options: BrokerOptions = {
    ...defaultsDeep(config, DEFAULTS),
    middlewares: [
      ChannelsMiddleware({
        adapter: process.env.ATOMSTACK_CHANNEL_ADAPTER! as string,
        sendMethodName: "sendToChannel",
        adapterPropertyName: "channelsAdapter",
        schemaProperty: "channels",
        context: true,
        channelHandlerTrigger: null
      }),
      EncryptionMiddleware,
      AtomstackMiddlware
    ],
    validator: new OmniValidator()
  }

  return options
}
