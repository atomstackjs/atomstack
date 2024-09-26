import { Validators, Errors } from "moleculer";
import { AnyObject, object, ObjectSchema, ValidationError, } from "yup";
import { ObjectShape } from "yup/lib/util/objectTypes.js";

export class YupValidator extends Validators.Base {
  validator?: ObjectSchema<AnyObject, AnyObject, unknown>;

  compile(schema: ObjectShape): Validators.Base.CheckerFunction {
    this.validator = object(schema);

    const checkerFunction: Validators.Base.CheckerFunction = async (params: Record<string, unknown>) => {
      await this.validator!.validate(params, { abortEarly: true });

      return true
    }

    checkerFunction.async = true;

    return checkerFunction
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(params: Record<string, unknown>, _schema: ObjectShape): boolean {
    try {
      this.validator?.validateSync(params, { abortEarly: true });

      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new Errors.ValidationError("Parameters validation error!", "", error.errors);
      }

      throw error;
    }
  }

  convertSchemaToMoleculer(schema: ObjectShape): Record<string, unknown> {
    return schema;
  }
}
