import { ServiceBroker } from "moleculer"
export * from "./Configure.ts"
export * as Mixins from "./Mixins/index.ts"
export * as ServiceValidators from "./ServiceValidators/index.ts"

declare global {
  const broker: ServiceBroker
}

declare module "moleculer" {
  interface ServiceBroker {
    sendToChannel: (channelName: string, payload: unknown, opts?: unknown) => Promise<void>
  }
}

