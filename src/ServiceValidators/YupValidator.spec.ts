import { beforeEach, it, expect, describe, beforeAll, afterAll } from "@jest/globals";
import { YupValidator } from "./YupValidator.ts";
import { Errors, ServiceSchema } from "moleculer";
import * as yup from "yup";
import { ServiceBroker } from "../../../moleculer/moleculer-js/index.js";
import { SetupSpec } from "../util/SetupSpec.ts";

describe("YupValidator", () => {

  describe("Unit tests", () => {
    let validator: YupValidator;

    beforeEach(() => {
      validator = new YupValidator({});
    });

    describe("compile", () => {
      it("should compile a schema correctly", () => {
        const schema = {
          name: yup.string().required(),
        };

        const checkerFunction = validator.compile(schema);

        expect(typeof checkerFunction).toBe("function");
      });
    });

    describe("validate", () => {
      it("should validate parameters correctly", () => {
        const schema = {
          name: yup.string().required(),
        };

        validator.compile(schema);

        const params = { name: "John Doe" };

        expect(validator.validate(params, schema)).toBe(true);
      });

      it("should throw a ValidationError for invalid parameters", () => {
        const schema = {
          name: yup.string().required(),
        };

        validator.compile(schema);

        const params = {};

        expect(() => validator.validate(params, schema)).toThrow(Errors.ValidationError);
      });
    });

    describe("convertSchemaToMoleculer", () => {
      it("should return the schema as is", () => {
        const schema = {
          name: yup.string().required(),
        };

        expect(validator.convertSchemaToMoleculer(schema)).toBe(schema);
      });
    });
  });

  describe("Integration tests", () => {
    let broker: ServiceBroker;
    let remoteBroker: ServiceBroker;

    const FakeServiceSchema: ServiceSchema = {
      name: "fake",
      actions: {
        test: {
          params: {
            $$validator: YupValidator,
            name: yup.string().required(),
            asyncName: yup.string().required().test(async (value: string) => {
              return await broker.call<boolean, { value: string }>("fake2.test", { value })
            })
          },
          handler(ctx) {
            return ctx.params.name
          }
        }
      }
    }

    const FakeServiceSchema2: ServiceSchema = {
      name: "fake2",
      actions: {
        test: {
          handler(ctx) {
            if (ctx.params.value === "Joe") {
              return true
            }

            return false
          }
        }
      }
    }

    beforeAll(async () => {
      broker = await SetupSpec({ logger: true, logLevel: "debug" })
      await broker.start()
      broker.createService(FakeServiceSchema)
      broker.createService(FakeServiceSchema2)
      remoteBroker = await SetupSpec({ nodeID: "remote", logger: true, logLevel: "debug" })
      await remoteBroker.start()
      await remoteBroker.waitForServices("fake")
      await remoteBroker.waitForServices("fake2")
    })

    afterAll(() => {
      broker.stop()
      remoteBroker.stop()
    });


    it("should validate parameters correctly", async () => {
      let res = await remoteBroker.call("fake.test", { name: "John Doe", asyncName: "Joe" })
      expect(res).toBe("John Doe")
      await expect(async () => await remoteBroker.call("fake.test", {})).rejects.toThrow(Errors.ValidationError)
    })

    it("should correctly handle async validations", async () => {
      await expect(async () => await remoteBroker.call("fake.test", {
        name: "present",
        asyncName: "John Doe"
      })).rejects.toThrow(Errors.ValidationError)
    })
  })
})
