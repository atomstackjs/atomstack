import { Validators } from "moleculer";
import { cloneDeep } from "lodash"

interface IOmniValidatorSchema {
  [key: string]: unknown
  $$validator?: typeof Validators.Base
}

type TValidatorList = Record<string, Validators.Base>

export class OmniValidator extends Validators.Base {
  readonly validators: TValidatorList = {}

  constructor(opts?: Validators.Base.ValidatorOptions) {
    super(opts || {})
  }


  compile(schema: IOmniValidatorSchema): Validators.Base.CheckerFunction {
    let validator: Validators.Base;
    if (schema.$$validator) {
      if (!this.validators[schema.$$validator.name]) {
        const ValidatorClass = schema.$$validator as new (opts: Validators.Base.ValidatorOptions) => Validators.Base;

        this.validators[schema.$$validator.name] = new ValidatorClass(this.opts);
        this.validators[schema.$$validator.name].init(this.broker);
      }

      validator = this.validators[schema.$$validator.name];
    } else {
      if (!this.validators[Validators.Fastest.name]) {
        this.validators[Validators.Fastest.name] = new Validators.Fastest(this.opts);
        this.validators[Validators.Fastest.name].init(this.broker);
      }

      validator = this.validators[Validators.Fastest.name];
    }

    const schemaClone = cloneDeep(schema);
    delete schemaClone.$$validator;

    return validator.compile(schemaClone);
  }

  validate(params: Record<string, unknown>, schema: IOmniValidatorSchema): boolean {
    const validator = this.validators[schema.$$validator?.name || Validators.Fastest.name]!;

    const schemaClone = cloneDeep(schema);
    delete schemaClone.$$validator;

    return validator.validate(params, schemaClone);
  }

  convertSchemaToMoleculer(schema: IOmniValidatorSchema): Record<string, unknown> {
    const s = cloneDeep(schema);
    delete s.$$validator;

    return s
  }
}
