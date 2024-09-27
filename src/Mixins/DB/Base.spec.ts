import { ServiceBroker, ServiceSchema } from "moleculer";
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { SetupSpec } from "../../util/SetupSpec.ts";
import { Prisma, PrismaClient, TestModel } from "./prisma/_client_/index.js";
import TestModelServiceSchema, { TTestModelService } from "./test-model.service.ts";
import { faker } from "@faker-js/faker"
import { encrypt } from "../../util/encryption.ts";

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
        expect(res).toEqual(expect.objectContaining({ id: expect.stringMatching(/^c/), plainText: "test" }))
      })
    })

    describe("encryption", () => {
      it("should encrypt fields listed as encrypted", async () => {
        const res = await broker.call<TestModel, Prisma.TestModelCreateArgs>(
          "$test.db.test-model.create",
          { data: { plainText: "test", encryptedText: "test" } }
        )

        const record = await prisma.testModel.findUnique({ where: { id: res.id } })


        expect(record?.encryptedText).not.toEqual("test")
      })

      it("should encrypt fields listed as deterministic using deterministic encryption", async () => {
        const res = await broker.call<TestModel, Prisma.TestModelCreateArgs>(
          "$test.db.test-model.create",
          { data: { plainText: "test", deterministicEncryptedText: "test" } }
        )
        const record = await prisma.testModel.findUnique({ where: { id: res.id } })
        expect(record?.deterministicEncryptedText).not.toEqual("test")

        const encryptedText = (await encrypt(Buffer.from("test"), true)).toString()
        expect(record?.deterministicEncryptedText).toEqual(encryptedText)
      })


      describe("find", () => {
        describe("findUnique", () => {
          it("should return a record", async () => {
            const deterministicEncryptedText = faker.string.uuid()
            const res = await broker.call<TestModel, Prisma.TestModelCreateArgs>(
              "$test.db.test-model.create",
              { data: { deterministicEncryptedText } }
            )
            const record = await broker.call<TestModel, Prisma.TestModelFindUniqueArgs>(
              "$test.db.test-model.findUnique",
              { where: { deterministicEncryptedText } }
            )
            expect(record).toEqual(expect.objectContaining({ id: res.id }))
          })
        })

        describe("count", () => {
          it("should return the count of records", async () => {
            const deterministicEncryptedText = faker.string.uuid()

            await broker.call<TestModel, Prisma.TestModelCreateArgs>(
              "$test.db.test-model.create",
              { data: { deterministicEncryptedText } }
            )

            const count = await broker.call<number, Prisma.TestModelCountArgs>(
              "$test.db.test-model.count",
              { where: { deterministicEncryptedText } }
            )

            expect(count).toEqual(1)
          })
        })
      });
    })
  })
})


