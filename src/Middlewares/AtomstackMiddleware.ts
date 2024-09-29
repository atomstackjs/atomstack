import { Middleware } from "moleculer";
import Path from "path";
import { BASE_TENANT_ID } from "../Configure.ts";

const AtomstackMiddleware: Middleware = {
  name: "AtomstackMiddlware",
  async started(broker) {
    if (broker.metadata.repl !== true) {
      broker.loadServices(Path.resolve(process.env.ATOMSTACK_ROOT!, "services"), "**/*.service.ts");
    }

    if (broker.tenantId == BASE_TENANT_ID) {
    }
  }
}

export default AtomstackMiddleware;
