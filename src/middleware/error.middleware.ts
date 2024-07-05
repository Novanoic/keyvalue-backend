import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/http.exception";
import ValidationException from "../exceptions/validation.exception";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (error instanceof HttpException) {
      const status: number = error.status || 500;
      const message: string = error.message || "Something went wrong";
      let resbody = { message: message };
      res.status(status).send(resbody);
    } else if (error instanceof ValidationException) {
      const status: number = error.status || 400;
      const message: string = error.message || "Something went wrong";
      let resbody = { message: message };
      res.status(status).send(resbody);
    } else {
      console.error(error.stack);
      res.status(500).send({ error: error.message });
    }
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
