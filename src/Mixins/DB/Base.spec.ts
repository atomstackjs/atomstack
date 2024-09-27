import { ServiceBroker } from "moleculer";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { SetupSpec } from "../../util/SetupSpec.ts";
import { Prisma, PrismaClient, TestModel } from "./prisma/_client_/index.js";
import TestModelServiceSchema, { TTestModelService } from "./test-model.service.ts";
import bcrypt from "bcrypt";

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

    describe("actions", () => {
      describe("$test.db.test-model.create", () => {
        it("should create a new record", async () => {
          const res = await broker.call<TestModel, Prisma.TestModelCreateArgs>(
            "$test.db.test-model.create",
            { data: { plainText: "test" } }
          )
          expect(res).toEqual(expect.objectContaining({ id: expect.stringMatching(/^c/), plainText: "test" }))
        })
      })
    })

    describe("encryption", () => {
      describe("hashedFields", () => {
        it("should hash the field", async () => {
          const res = await broker.call<TestModel, Prisma.TestModelCreateArgs>(
            "$test.db.test-model.create",
            { data: { hashedText: "test" } }
          )

          expect(bcrypt.compareSync("test", res.hashedText!)).toBe(true)
        })
      })
    })
  })
})


