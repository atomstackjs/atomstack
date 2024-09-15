import { ServiceBroker } from "moleculer"
export * from "./Configure.ts"



declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      broker: ServiceBroker
    }
  }
}

declare module "moleculer" {
  interface ServiceBroker {
    sendToChannel: (channelName: string, payload: unknown, opts?: unknown) => Promise<void>
  }
}
