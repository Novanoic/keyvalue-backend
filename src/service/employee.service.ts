import { Repository, UpdateResult } from "typeorm";
import Employee from "../entity/employee.entity";
import { EmployeeRepository } from "../repository/employee.repository";
import Address from "../entity/address.entity";
import { Role } from "../utils/role.enums";
import bcrypt from "bcrypt";
import { jwtPayload } from "../utils/jwtPayload.type";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import EntityNotFoundException from "../exceptions/entitiynotfound.exception";
import IncorrectPasswordException from "../exceptions/incorrectpassword.exception";
import { ErrorCodes } from "../utils/error.codes";
import Department from "../entity/department.entity";
import { DepartmentService } from "./department.service";
import HttpException from "../exceptions/http.exception";
import { Status } from "../utils/status.enums";
import { stat } from "fs";

export class EmployeeService {
  constructor(
    private employeerepository: EmployeeRepository,
    private departmentservice: DepartmentService
  ) {}

  loginEmployee = async (email: string, password: string) => {
    const employee = await this.employeerepository.findOneBy({ email });
    if (!employee) {
      throw new EntityNotFoundException(ErrorCodes.VALIDATION_ERROR);
    }
    const result = await bcrypt.compare(password, employee.password);

    if (!result) {
      throw new IncorrectPasswordException(ErrorCodes.INCORRECT_PASSWORD);
    }

    const payload: jwtPayload = {
      name: employee.name,
      email: employee.email,
      role: employee.role,
    };

    const token = jsonwebtoken.sign(payload, JWT_SECRET, {
      expiresIn: JWT_VALIDITY,
    });

    return { token };
  };

  getAllEmployees = (): Promise<Employee[]> => {
    return this.employeerepository.find();
  };

  getEmployeeById = (id: number): Promise<Employee | null> => {
    return this.employeerepository.findOneBy({ id });
  };

  createEmployee = async (
    email: string,
    name: string,
    jdate: Date,
    address: any,
    department: any,
    role: Role,
    password: string,
    status: Status,
    experience: string
  ): Promise<Employee> => {
    const newEmployee = new Employee();
    newEmployee.email = email;
    newEmployee.name = name;
    newEmployee.jdate = jdate;
    newEmployee.role = role;
    newEmployee.password = password ? await bcrypt.hash(password, 10) : "";
    newEmployee.status = status;
    newEmployee.experience = experience;

    const employeeDepartment = new Department();
    employeeDepartment.name = department.name;

    newEmployee.department = employeeDepartment;

    const newAddress = new Address();
    newAddress.line = address.line;
    // newAddress.pincode = address.pincode;

    newEmployee.address = newAddress;

    return this.employeerepository.create(newEmployee);
  };

  deleteEmployee = async (id: number): Promise<UpdateResult> => {
    const employee = await this.employeerepository.findOneBy({ id });
    return this.employeerepository.removeBy(employee);
  };

  removeEmployee = async (id: number): Promise<Employee> | null => {
    const employee = await this.employeerepository.findOneBy({ id });
    return this.employeerepository.softRemove(employee);
  };

  updateEmployee = async (
    id: number,
    email: string,
    name: string,
    jdate: Date,
    address: any,
    department: any,
    role: Role,
    password: string,
    status: Status,
    experience: string
  ): Promise<Employee> => {
    const employee = await this.employeerepository.findOneBy({ id });
    if (!employee) {
      const error = new HttpException(
        404,
        `No employee found with the ID : ${id}`
      );
      throw error;
    }
    const updatedDepartment = await this.departmentservice.getDepartmentByName(
      department.name
    );
    if (!updatedDepartment) {
      const error = new HttpException(
        404,
        `No department found with this name : ${department.name}`
      );
      throw error;
    }
    employee.name = name;
    employee.email = email;
    employee.jdate = jdate;
    employee.status = status;
    employee.experience = experience;
    employee.department.name = updatedDepartment.name;
    employee.address.line = address.line;
    // employee.address.pincode = address.pincode;
    employee.role = role;
    employee.password = password ? await bcrypt.hash(password, 10) : "";

    return this.employeerepository.create(employee);
  };
}
