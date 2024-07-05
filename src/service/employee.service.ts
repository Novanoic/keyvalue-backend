import { UpdateResult } from "typeorm";
import Employee from "../entity/employee.entity";
import { EmployeeRepository } from "../repository/employee.repository";
import Address from "../entity/address.entity";
import { Role } from "../utils/role.enums";
import bcrypt from "bcrypt";
import HttpException from "../exceptions/http.exception";
import { jwtPayload } from "../utils/jwtPayload.type";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import EntityNotFoundException from "../exceptions/entitiynotfound.exception";
import IncorrectPasswordException from "../exceptions/incorrectpassword.exception";
import { ErrorCodes } from "../utils/error.codes";

export class EmployeeService {
  //   private employeerepository: EmployeeRepository;
  constructor(private employeerepository: EmployeeRepository) {
    // this.employeerepository = new EmployeeRepository();
  }

  loginEmployee = async (email: string, password: string) => {
    const employee = await this.employeerepository.findOneBy({ email });
    if (!employee) {
      throw new EntityNotFoundException(ErrorCodes.VALIDATION_ERROR);
    }
    const result = await bcrypt.compare(password, employee.password);

    if (!result) {
      throw new IncorrectPasswordException("Password is incorrect");
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
    age: number,
    address: any,
    role: Role,
    password: string
  ): Promise<Employee> => {
    const newEmployee = new Employee();
    newEmployee.email = email;
    newEmployee.name = name;
    newEmployee.age = age;
    newEmployee.role = role;
    newEmployee.password = password ? await bcrypt.hash(password, 10) : "";

    const newAddress = new Address();
    newAddress.line = address.line;
    newAddress.pincode = address.pincode;

    newEmployee.address = newAddress;

    return this.employeerepository.create(newEmployee);
  };

  deleteEmployee = async (id: number): Promise<UpdateResult> => {
    const employee = await this.employeerepository.findOneBy({ id });
    return this.employeerepository.removeBy(employee);
  };

  removeEmployee = async (id: number): Promise<Employee> => {
    const employee = await this.employeerepository.findOneBy({ id });
    return this.employeerepository.softRemove(employee);
  };

  updateEmployee = async (
    id: number,
    email: string,
    name: string,
    age: number,
    address: any,
    role: Role,
    password: string
  ): Promise<Employee> => {
    const employee = await this.employeerepository.findOneBy({ id });
    employee.name = name;
    employee.email = email;
    employee.age = age;
    employee.address.line = address.line;
    employee.address.pincode = address.pincode;
    employee.role = role;
    employee.password = password;

    return this.employeerepository.create(employee);
  };
}
