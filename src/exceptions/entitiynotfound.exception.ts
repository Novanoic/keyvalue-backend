import { CustomError } from "../utils/error.codes";
import HttpException from "./http.exception";

class EntityNotFoundException extends HttpException {
  constructor(error: CustomError) {
    super(404, error.MESSAGE);
  }
}

export default EntityNotFoundException;
