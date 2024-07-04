import { UpdateResult } from "typeorm";
import Employee from "../entity/employee.entity";
import { EmployeeRepository } from "../repository/employee.repository";
import Address from "../entity/address.entity";

export class EmployeeService {
  //   private employeerepository: EmployeeRepository;
  constructor(private employeerepository: EmployeeRepository) {
    // this.employeerepository = new EmployeeRepository();
  }

  getAllEmployees = (): Promise<Employee[]> => {
    return this.employeerepository.find();
  };

  getEmployeeById = (id: number): Promise<Employee> => {
    return this.employeerepository.findOneBy({ id });
  };

  createEmployee = (
    name: string,
    email: string,
    age: number,
    address: any
  ): Promise<Employee> => {
    const newEmployee = new Employee();
    newEmployee.email = email;
    newEmployee.name = name;
    newEmployee.age = age;

    const newAddress = new Address();
    newAddress.line = address.line;
    newAddress.pincode = address.pincode;

    newEmployee.address = newAddress;

    return this.employeerepository.create(newEmployee);
  };

  deleteEmployee = async (id: number): Promise<Employee> => {
    const employee = await this.employeerepository.findOneBy({ id });
    return this.employeerepository.softRemove(employee);
  };

  updateEmployee = async (
    id: number,
    name: string,
    email: string,
    age: number,
    address
  ): Promise<Employee> => {
    const employee = await this.employeerepository.findOneBy({ id });
    employee.name = name;
    employee.email = email;
    employee.age = age;
    const newAddress = new Address();
    newAddress.line = address.line;
    newAddress.pincode = address.pincode;

    employee.address = newAddress;

    return this.employeerepository.create(employee);
  };
}
