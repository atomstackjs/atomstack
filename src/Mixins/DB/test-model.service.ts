import { ServiceSchema } from "moleculer";
import { Base } from "./Base.ts";
import { IService } from "./IService.ts";
import { Prisma, PrismaClient } from "./prisma/_client_/index.js";

export type TTestModelService = IService<PrismaClient, Prisma.TestModelDelegate>

const TestModelServiceSchema: ServiceSchema<TTestModelService> = {
  name: "$test.db.test-model",

  settings: {
    encryptedFields: ["encryptedText"],
    deterministicEncryptedFields: ["deterministicEncryptedText"],
    hashedFields: ["hashedText"]
  },

  mixins: [Base<TTestModelService>(PrismaClient, "testModel")],
};

export default TestModelServiceSchema;
