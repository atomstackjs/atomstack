import { ServiceBroker } from "moleculer"

export { Configure } from "./Configure.ts"
export * as Mixins from "./Mixins/index.ts"
export * as ServiceValidators from "./ServiceValidators/index.ts"



declare module "moleculer" {
  interface ServiceBroker {
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

