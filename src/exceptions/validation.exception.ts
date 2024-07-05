import { ValidationError } from "class-validator";

class ValidationException extends Error {
  public status: number;
  public error: ValidationError[];

  constructor(status: number, message: string, error: ValidationError[]) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

export default ValidationException;
