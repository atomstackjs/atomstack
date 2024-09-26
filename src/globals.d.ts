import { type ServiceBroker as MolerculerServiceBroker } from "moleculer"

declare module "moleculer" {
  interface ServiceBroker extends MolerculerServiceBroker {
    sendToChannel: (channelName: string, payload: unknown, opts?: unknown) => Promise<void>
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      broker: ServiceBroker;
    }
  }
  let broker: ServiceBroker
}

