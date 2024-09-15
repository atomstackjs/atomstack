import { Validators } from "moleculer";
import { OmniValidator } from "./OmniValidator.ts";
import { beforeEach, it, expect, describe, jest } from "@jest/globals";

class MockValidator extends Validators.Base {
  constructor(opts: Validators.Base.ValidatorOptions) {
    super(opts);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compile(_schema: Record<string, unknown>): Validators.Base.CheckerFunction {
    const func = () => true;
    func.async = false;

    return func
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(_params: Record<string, unknown>, _schema: Record<string, unknown>): boolean {
    return true;
  }

  convertSchemaToMoleculer(schema: Record<string, unknown>): Record<string, unknown> {
    return schema
  }
}

describe("OmniValidator", () => {
  let omniValidator: OmniValidator;
  const mockOpts = {};

  beforeEach(() => {
    omniValidator = new OmniValidator(mockOpts);
  });

  it("should create an instance of OmniValidator", () => {
    expect(omniValidator).toBeInstanceOf(OmniValidator);
  });

  it("should compile schema with a validator", () => {
    const schema = {
      $$validator: MockValidator,
    };

    omniValidator.compile(schema);

    expect(omniValidator.validators[schema.$$validator.name]).toBeInstanceOf(MockValidator);
  });

  it("should not recompile the same validator", () => {
    const schema = {
      $$validator: MockValidator,
    };

    omniValidator.compile(schema);
    const firstInstance = omniValidator.validators[schema.$$validator.name];

    omniValidator.compile(schema);
    const secondInstance = omniValidator.validators[schema.$$validator.name];

    expect(firstInstance).toBe(secondInstance);
  });

  it("should handle schema without a validator", () => {
    const schema = {};

    expect(() => omniValidator.compile(schema)).not.toThrow();
  });

  it("should not have $$validator property in the compiled schema", () => {
    const schema = {
      $$validator: MockValidator,
      field: "value",
    };

    const mockValidatorInstance = new MockValidator({});
    const compileSpy = jest.spyOn(mockValidatorInstance, "compile");

    omniValidator.validators[MockValidator.name] = mockValidatorInstance;
    omniValidator.compile(schema);

    expect(compileSpy).toHaveBeenCalledWith(expect.not.objectContaining({ $$validator: expect.anything() }));
  });
});

