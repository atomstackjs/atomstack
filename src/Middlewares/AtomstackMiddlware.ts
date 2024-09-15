import { Middleware } from "moleculer";
import Path from "path";

const AtomstackMiddlware: Middleware = {
  name: "AtomstackMiddlware",
  async started(broker) {
    if (broker.metadata.repl !== true) {
      broker.loadService(Path.resolve(process.env.ATOMSTACK_SRC!, "services/db/locator/locator.service.ts"))
    }
  }
}

export default AtomstackMiddlware;
