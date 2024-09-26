import { BrokerOptions, ServiceBroker } from "moleculer";
import { TransporterType } from "../../../moleculer/moleculer-js/src/service-broker.js";
import { Configure } from "../Configure.ts";

export async function SetupSpec(options: Partial<BrokerOptions> = {}) {
  const config: BrokerOptions = {
    logger: false,
    ...options
  }
  process.env.NODE_ENV = "test";
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../boot.ts").default()
  process.env.ATOMSTACK_ROOT = process.env.ATOMSTACK_SRC
  const broker = new ServiceBroker(Configure(config))

  return broker
}

