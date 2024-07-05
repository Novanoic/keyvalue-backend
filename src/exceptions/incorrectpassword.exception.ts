import HttpException from "./http.exception";

class IncorrectPasswordException extends HttpException {
  constructor(message: string) {
    super(401, message);
  }
}

export default IncorrectPasswordException;
