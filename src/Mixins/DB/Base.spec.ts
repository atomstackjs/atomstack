import {ServiceBroker, ServiceSchema} from "moleculer";
import { beforeEach, describe, jest } from "@jest/globals";
import { SetupSpec } from "../../util/SetupSpec.ts";
import {Base, IDBService} from "./Base.ts";
import { Prisma, TestModel, PrismaClient } from "./prisma/client/index.js";
import TestModelDelegate = Prisma.TestModelDelegate;

jest.mock("@prisma/client");
jest.mock("../src/utils/encryption");

type TTestService = IDBService<TestModelDelegate>;

const TestServiceSchema: ServiceSchema = {
  name: "$test.db.test",
  mixins: [Base<TTestService, PrismaClient>(PrismaClient, "testModel")]
}

describe("Integration tests", () => {
  let broker: ServiceBroker;

  beforeEach(async () => {
    broker = await SetupSpec();
    broker.start()
  });
});


