import { Validator } from '../../../utils/types';

class BaseValidator implements Validator {
  private nextValidator: Validator | null = null;

  setNext(validator: Validator): Validator {
    this.nextValidator = validator;
    return validator;
  }

  validate(data: any): any {
    // TODO
    const result = this.nextValidator!.validate(data);
    return {
      ok: result.ok,
      message: result.message,
    };
  }
}

export default BaseValidator;
