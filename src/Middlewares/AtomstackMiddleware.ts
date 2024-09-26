import { Middleware } from "moleculer";
import Path from "path";
import {Glob} from "glob";

const AtomstackMiddleware: Middleware = {
  name: "AtomstackMiddlware",
  async started(broker) {
    if (broker.metadata.repl !== true) {
      broker.loadServices(Path.resolve(process.env.ATOMSTACK_ROOT!, "services"), "**/*.service.ts");
    }
  }
}

export default AtomstackMiddleware;
