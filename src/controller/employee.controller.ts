import { plainToInstance } from "class-transformer";
import HttpException from "../exceptions/http.exception";
import { EmployeeService } from "../service/employee.service";
import express from "express";
import { CreateEmployeeDto } from "../dto/employee.dto";
import { validate } from "class-validator";

class EmployeeController {
  //   private employeeService: EmployeeService;
  public router: express.Router;

  constructor(private employeeService: EmployeeService) {
    // this.employeeService = new EmployeeService();
    this.router = express.Router();

    this.router.get("/", this.getAllEmployees);
    this.router.get("/:id", this.getEmployeeById);
    this.router.put("/:id", this.updateEmployee);
    this.router.post("/", this.createEmployee);
    this.router.delete("/:id", this.deleteEmployee);
  }

  public getAllEmployees = async (
    req: express.Request,
    res: express.Response
  ) => {
    const employees = await this.employeeService.getAllEmployees();
    res.status(200).send(employees);
  };

  public getEmployeeById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employee = await this.employeeService.getEmployeeById(employeeId);
      if (!employee) {
        const error = new HttpException(
          404,
          `No employee found with the ID : ${req.params.id}`
        );
        throw error;
      }
      res.status(200).send(employee);
    } catch (err) {
      next(err);
    }
  };

  public createEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeDto = plainToInstance(CreateEmployeeDto, req.body);
      const errors = await validate(employeeDto);
      if (errors.length) {
        console.log(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }
      const employees = await this.employeeService.createEmployee(
        employeeDto.email,
        employeeDto.name,
        employeeDto.age,
        employeeDto.address
      );
      res.status(201).send(employees);
    } catch (err) {
      next(err);
    }
  };

  public deleteEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id);
      const employee = await this.employeeService.getEmployeeById(employeeId);
      if (!employee) {
        const error = new HttpException(
          404,
          `No employee found with the ID : ${req.params.id}`
        );
        throw error;
      }
      res.status(200).send(employee);
      const employees = await this.employeeService.deleteEmployee(employeeId);
      res.status(204).send(employees);
    } catch (err) {
      next(err);
    }
  };

  public updateEmployee = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { name, email, age, address } = req.body;
    const employees = await this.employeeService.updateEmployee(
      Number(req.params.id),
      name,
      email,
      age,
      address
    );
    res.status(200).send(employees);
  };
}

export default EmployeeController;
