import { Middleware } from "moleculer";

const AtomstackMiddleware: Middleware = {
  name: "AtomstackMiddlware",
  async started(broker) {
    if (broker.metadata.repl !== true) {
    }
  }
}

export default AtomstackMiddleware;
