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

    const FakeServiceSchema: ServiceSchema = {
      name: "fake",
      actions: {
        test: {
          params: {
            $$validator: YupValidator,
            name: yup.string().required()
          },
          handler(ctx) {
            return ctx.params.name
          }
        }
      }
    }

    beforeAll(async () => {
      broker = await SetupSpec()
      await broker.start()
      broker.createService(FakeServiceSchema)
      await broker.waitForServices("fake")
    })

    afterAll(() => {
      broker.stop()
    });


    it("should validate parameters correctly", async () => {
      const res = await broker.call("fake.test", { name: "John Doe" })
      expect(res).toBe("John Doe")
    })
  })
})
