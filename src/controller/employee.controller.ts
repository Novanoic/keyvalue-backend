import { plainToInstance } from "class-transformer";
import HttpException from "../exceptions/http.exception";
import { EmployeeService } from "../service/employee.service";
import express from "express";
import { CreateEmployeeDto, UpdateEmployeeDto } from "../dto/employee.dto";
import { validate } from "class-validator";
import { ValidationMetadata } from "class-validator/types/metadata/ValidationMetadata";
import ValidationException from "../exceptions/validation.exception";
import authorize from "../middleware/authentication.middleware";
import { RequestWithUser } from "../utils/requestwithuser";
import EntityNotFoundException from "../exceptions/entitiynotfound.exception";
import { Role } from "../utils/role.enums";
import { ErrorCodes } from "../utils/error.codes";
import { LoginAuthenticationDto } from "../dto/login.dto";

class EmployeeController {
  public router: express.Router;

  constructor(private employeeService: EmployeeService) {
    this.router = express.Router();

    this.router.get("/", authorize, this.getAllEmployees);
    this.router.get("/:id", authorize, this.getEmployeeById);
    this.router.patch("/:id", authorize, this.updateEmployee);
    this.router.post("/", authorize, this.createEmployee);
    this.router.delete("/:id", authorize, this.removeEmployee);
    this.router.post("/login", this.loginEmployee);
  }

  public loginEmployee = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const employeeDto = plainToInstance(LoginAuthenticationDto, req.body);
      const errors = await validate(employeeDto);
      if (errors.length) {
        throw new HttpException(400, `Please re-enter the credentials`);
      }
      const token = await this.employeeService.loginEmployee(
        employeeDto.email,
        employeeDto.password
      );
      res.status(200).send({ data: token });
    } catch (err) {
      next(err);
    }
  };

  public getAllEmployees = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;

      if (role != Role.HR && role != Role.CEO) {
        console.log(req.name);
        throw new EntityNotFoundException(ErrorCodes.UNAUTHORIZED);
      } else {
        const employees = await this.employeeService.getAllEmployees();
        res.status(200).send(employees);
      }
    } catch (err) {
      next(err);
    }
  };

  public getEmployeeById = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;

      if (role != Role.HR && role != Role.CEO) {
        console.log(req.name);
        throw new EntityNotFoundException(ErrorCodes.UNAUTHORIZED);
      } else {
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
      }
    } catch (err) {
      next(err);
    }
  };

  public createEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;

      if (role != Role.HR && role != Role.CEO) {
        console.log(req.name);
        throw new EntityNotFoundException(ErrorCodes.UNAUTHORIZED);
      } else {
        const employeeDto = plainToInstance(CreateEmployeeDto, req.body);
        const errors = await validate(employeeDto);
        if (errors.length) {
          console.log(JSON.stringify(errors));
          throw new HttpException(400, JSON.stringify(errors));
        }
        const employees = await this.employeeService.createEmployee(
          employeeDto.email,
          employeeDto.name,
          employeeDto.jdate,
          employeeDto.address,
          employeeDto.department,
          employeeDto.role,
          employeeDto.password,
          employeeDto.status,
          employeeDto.experience
        );
        res.status(201).send(employees);
      }
    } catch (err) {
      next(err);
    }
  };

  public removeEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;

      if (role != Role.HR && role != Role.CEO) {
        console.log(req.name);
        throw new EntityNotFoundException(ErrorCodes.UNAUTHORIZED);
      } else {
        const employeeId = Number(req.params.id);
        const employee = await this.employeeService.getEmployeeById(employeeId);
        if (!employee) {
          const error = new HttpException(
            404,
            `No employee found with the ID : ${req.params.id}`
          );
          throw error;
        }
        const employees = await this.employeeService.removeEmployee(employeeId);
        res.status(204).send(employees);
      }
    } catch (err) {
      next(err);
    }
  };

  public updateEmployee = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const role = req.role;

      if (role != Role.HR && role != Role.CEO) {
        console.log(req.name);
        throw new EntityNotFoundException(ErrorCodes.UNAUTHORIZED);
      } else {
        const employeeDto = plainToInstance(UpdateEmployeeDto, req.body);
        const errors = await validate(employeeDto);
        if (errors.length) {
          console.log(errors);
          throw new ValidationException(400, "Validation Failed", errors);
        }
        const employees = await this.employeeService.updateEmployee(
          Number(req.params.id),
          employeeDto.email,
          employeeDto.name,
          employeeDto.jdate,
          employeeDto.address,
          employeeDto.department,
          employeeDto.role,
          // employeeDto.password,
          employeeDto.status,
          employeeDto.experience
        );
        res.status(200).send(employees);
      }
    } catch (err) {
      next(err);
    }
  };
}
export default EmployeeController;
