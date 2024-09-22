import Base from "../../../Mixins/DB/Base.js";
import { PrismaClient } from "./prisma/client/index.js";

export default {
  name: "$stack.db.locator",
  mixins: [Base(PrismaClient, "locator")],
};
