const express = require("express");
import { Request, Response } from "express";
import employeeRouter from "./routes/employee.routes";
import departmentRouter from "./routes/department.routes";
import loggerMiddleware from "./middleware/logger.middleware";
import bodyParser from "body-parser";
import dataSource from "./db/data-source.db";
import errorMiddleware from "./middleware/error.middleware";
// import loginRouter from "./routes/login.routes";

const server = new express();

server.use(bodyParser.json());
server.use(loggerMiddleware);
server.use("/employees", employeeRouter);
server.use("/department", departmentRouter);
// server.use("/login", loginRouter);

server.use(errorMiddleware);

server.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World");
});

(async () => {
  try {
    await dataSource.initialize();
  } catch (e) {
    console.log("Failed", e);
    process.exit(1);
  }
  server.listen(3000, () => {
    console.log("The server is running on port 3000");
  });
})();
