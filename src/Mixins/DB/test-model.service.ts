import { Base } from "./Base.ts";
import { IService } from "./IService.ts";
import { Prisma, PrismaClient } from "./prisma/_client_/index.js";
import TestModelFindUniqueArgs = Prisma.TestModelFindUniqueArgs;
import { Context, ServiceSchema } from "moleculer";

export type TTestModelService = IService<PrismaClient>

const TestModelServiceSchema: ServiceSchema<TTestModelService> = {
  name: "$test.db.test-model",

  settings: {
    encryptedFields: ["encryptedText"],
    deterministicEncryptedFields: ["deterministicEncryptedText"]
  },

  mixins: [Base],

  async started() {
    this.prisma = new PrismaClient()
  },

  stopped() {
    this.prisma.$disconnect()
  },

  actions: {
    count: {
      async handler(ctx: Context<Prisma.TestModelCountArgs>) {
        return this.prisma.testModel.count(ctx.params)
      }
    },
    findUnique: {
      async handler(ctx: Context<TestModelFindUniqueArgs>) {
        return this.prisma.testModel.findUnique(ctx.params)
      }
    },
    findUniqueOrThrow: {
      async handler(ctx: Context<TestModelFindUniqueArgs>) {
        return this.prisma.testModel.findUnique(ctx.params)
      }
    },
    findFirst: {
      async handler(ctx: Context<Prisma.TestModelFindFirstArgs>) {
        return this.prisma.testModel.findFirst(ctx.params)
      }
    },
    findFirstOrThrow: {
      async handler(ctx: Context<Prisma.TestModelFindFirstArgs>) {
        return this.prisma.testModel.findFirst(ctx.params)
      }
    },
    findMany: {
      async handler(ctx: Context<Prisma.TestModelFindManyArgs>) {
        return this.prisma.testModel.findMany(ctx.params)
      }
    },
    create: {
      async handler(ctx: Context<Prisma.TestModelCreateArgs>) {
        return this.prisma.testModel.create(ctx.params)
      }
    },
    createMany: {
      async handler(ctx: Context<Prisma.TestModelCreateManyArgs>) {
        return this.prisma.testModel.createMany(ctx.params)
      }
    },
    update: {
      async handler(ctx: Context<Prisma.TestModelUpdateArgs>) {
        return this.prisma.testModel.update(ctx.params)
      }
    },
    updateMany: {
      async handler(ctx: Context<Prisma.TestModelUpdateManyArgs>) {
        return this.prisma.testModel.updateMany(ctx.params)
      }
    },
    delete: {
      async handler(ctx: Context<Prisma.TestModelDeleteArgs>) {
        return this.prisma.testModel.delete(ctx.params)
      }
    },
    deleteMany: {
      async handler(ctx: Context<Prisma.TestModelDeleteManyArgs>) {
        return this.prisma.testModel.deleteMany(ctx.params)
      }
    },
    aggregate: {
      async handler(ctx: Context<Prisma.TestModelAggregateArgs>) {
        return this.prisma.testModel.aggregate(ctx.params)
      }
    }
  }
};

export default TestModelServiceSchema;
