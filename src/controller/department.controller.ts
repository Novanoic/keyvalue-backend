import { plainToInstance } from "class-transformer";
import HttpException from "../exceptions/http.exception";
import { DepartmentService } from "../service/department.service";
import express from "express";
import { CreateDepartmentDto } from "../dto/department.dto";
import {
  validate,
  ValidateNested,
  ValidatePromise,
  ValidationTypes,
  ValidatorOptions,
} from "class-validator";
import { ValidationMetadata } from "class-validator/types/metadata/ValidationMetadata";
import ValidationException from "../exceptions/validation.exception";
import authorize from "../middleware/authentication.middleware";
import { RequestWithUser } from "../utils/requestwithuser";
import EntityNotFoundException from "../exceptions/entitiynotfound.exception";
import { Role } from "../utils/role.enums";
import { ErrorCodes } from "../utils/error.codes";

class DepartmentController {
  //   private employeeService: EmployeeService;
  public router: express.Router;

  constructor(private departmentService: DepartmentService) {
    // this.employeeService = new EmployeeService();
    this.router = express.Router();

    this.router.get("/", this.getAllDepartments);
    this.router.get("/:id", this.getDepartmentById);
    this.router.put("/:id", this.updateDepartment);
    this.router.post("/", authorize, this.createDepartment);
    this.router.delete("/:id", authorize, this.removeDepartment);
  }


  public getAllDepartments = async (
    req: express.Request,
    res: express.Response
  ) => {
    const department = await this.departmentService.getAllDepartments();
    res.status(200).send(department);
  };

  public getDepartmentById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id);
      const department = await this.departmentService.getDepartmentById(
        departmentId
      );
      if (!department) {
        const error = new HttpException(
          404,
          `No department found with the ID : ${req.params.id}`
        );
        throw error;
      }
      res.status(200).send(department);
    } catch (err) {
      next(err);
    }
  };

  public createDepartment = async (
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
        const departmentDto = plainToInstance(CreateDepartmentDto, req.body);
        const errors = await validate(departmentDto);
        if (errors.length) {
          console.log(JSON.stringify(errors));
          throw new HttpException(400, JSON.stringify(errors));
        }
        const departments = await this.departmentService.createDepartment(
          departmentDto.name
        );
        res.status(201).send(departments);
      }
    } catch (err) {
      next(err);
    }
  };

  public removeDepartment = async (
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
        const departmentId = Number(req.params.id);
        const department = await this.departmentService.getDepartmentById(
          departmentId
        );
        if (!department) {
          const error = new HttpException(
            404,
            `No department found with the ID : ${req.params.id}`
          );
          throw error;
        }
        const departments = await this.departmentService.removeDepartment(
          departmentId
        );
        res.status(204).send(departments);
      }
    } catch (err) {
      next(err);
    }
  };

  public updateDepartment = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const departmentDto = plainToInstance(CreateDepartmentDto, req.body);
      const errors = await validate(departmentDto);
      if (errors.length) {
        console.log(errors);
        throw new ValidationException(400, "Validation Failed", errors);
      }
      const departments = await this.departmentService.updateDepartment(
        Number(req.params.id),
        departmentDto.name
      );
      res.status(200).send(departments);
    } catch (err) {
      next(err);
    }
  };
}
export default DepartmentController;
