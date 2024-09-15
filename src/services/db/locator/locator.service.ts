import { ServiceSchema } from "moleculer";
import BaseDBMixin, { IDBServiceSchema } from "../../../Mixins/BaseDBMixin.ts";
import { PrismaClient } from "./prisma/client/index.js";

const DBLocatorService: IDBServiceSchema<PrismaClient> = {
  name: "$stack.db.locator",
  mixins: [BaseDBMixin<PrismaClient>(PrismaClient, "locator") as Partial<ServiceSchema>],
}

export default DBLocatorService as ServiceSchema;
