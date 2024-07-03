import express from "express";
import { Request, Response } from "express";
import Employee from "./Employee";
import dataSource from "./data-source";
import { UpdateDateColumn } from "typeorm";

const employeeRouter = express.Router();

employeeRouter.get("/", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const employees = await employeeRepository.find();
  res.status(200).send(employees);
});

employeeRouter.get("/:id", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const employees = await employeeRepository.findOneBy({
    id: Number(req.params.id),
  });
  res.status(200).send(employees);
});

employeeRouter.put("/:id", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const employees = await employeeRepository.findOneBy({
    id: Number(req.params.id),
  });
  employees.name = req.body.name;
  employees.email = req.body.email;
  const updatedEmployee = await employeeRepository.save(employees);
  res.status(200).send(updatedEmployee);
});

employeeRouter.delete("/:id", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  await employeeRepository.softDelete({
    id: Number(req.params.id),
  });
  res.status(204).send(`An employee was deleted`);
});

employeeRouter.post("/", async (req: Request, res: Response) => {
  const employeeRepository = dataSource.getRepository(Employee);
  const newEmployee = new Employee();
  newEmployee.email = req.body.email;
  newEmployee.name = req.body.name;
  const savedEmployee = await employeeRepository.save(newEmployee);
  res.status(201).send(savedEmployee);
});

export default employeeRouter;
