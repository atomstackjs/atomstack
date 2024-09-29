import { ServiceBroker, Context } from "moleculer"

export { Configure } from "./Configure.ts"
export * as Mixins from "./Mixins/index.ts"
export * as ServiceValidators from "./ServiceValidators/index.ts"



declare module "moleculer" {
  interface ServiceBroker {
    sendToChannel: (channelName: string, payload: unknown, opts?: unknown) => Promise<void>
    tenantId: string
  }

  interface ServiceSchema<TService> {
    channels: {
      [key: string]: (ctx: Context<any>) => Promise<void>
    } & ThisType<TService>
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

