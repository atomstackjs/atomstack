import { Transporters, type Middleware } from "moleculer";
import { decrypt, encrypt } from "../util/encryption.ts";

/**
 * This middleware encrypts and decrypts all transit data. This is similar to Moleculer's built in encryption middleware.
 * differing in that it does not require the initialization vector to be configured in the broker options, but instead
 * using a random IV at encryption time.
 * @param broker the service broker (passed by Moleculer)
 * @constructor
 */
export const EncryptionMiddleware: Middleware = {
  name: "EncryptionMiddleware",

  transporterSend(next) {
    return async function (topic, data, opts) {
      const res = Buffer.from(await encrypt(data))
      return next(topic, res, opts)
    }
  },
  transporterReceive(next) {
    return async function (this: Transporters.Base, cmd, data, s) {
      try {
        const res = Buffer.from(await decrypt(data))
        return next(cmd, res, s)
      } catch (e) {
        this.broker.logger.error(e)
      }
    }
  }
}
