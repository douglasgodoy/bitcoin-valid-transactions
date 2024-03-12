export interface Validator {
  setNext(validator: Validator): Validator;
  validate(data: any): any; //TODO -
}

export interface Map {
  [key: string]: string | undefined;
}
