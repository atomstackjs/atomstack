import {ServiceBroker, ServiceSchema} from "moleculer";
import {afterAll, beforeAll, beforeEach, describe, expect, it, jest} from "@jest/globals";
import { SetupSpec } from "../../util/SetupSpec.ts";
import {Prisma, PrismaClient, TestModel} from "./prisma/client/index.js";
import TestModelServiceSchema from "./test-model.service.ts";
import {TTestModelService} from "./test-model.service.js";

describe("DB.Base", () => {
  describe("Integration tests", () => {
    let broker: ServiceBroker;
    let prisma: PrismaClient;

    beforeAll(async () => {
      broker = await SetupSpec();
      await broker.start()
      broker.createService<TTestModelService>(TestModelServiceSchema)
      await broker.waitForServices("$test.db.test-model")
      prisma = new PrismaClient()
    });

    afterAll(async () => {
      try {
        await broker.stop()
        prisma.$disconnect()
      } catch (e) {
        console.error("Failed to stop broker", e)
      }
    })

    describe("$test.db.test-model.create", () => {
      it("should create a new record", async () => {
        const res = await broker.call<TestModel, Prisma.TestModelCreateArgs>(
          "$test.db.test-model.create",
          { data: { plainText: "test" } }
        )
        expect(res).toEqual(expect.objectContaining({id: expect.stringMatching(/^c/), plainText: "test" }))
      })
    })

  });
})


