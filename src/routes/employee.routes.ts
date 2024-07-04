import EmployeeController from "../controller/employee.controller";
import dataSource from "../db/data-source.db";
import Employee from "../entity/employee.entity";
import { EmployeeRepository } from "../repository/employee.repository";
import { EmployeeService } from "../service/employee.service";

const employeeController = new EmployeeController(
  new EmployeeService(
    new EmployeeRepository(dataSource.getRepository(Employee))
  )
);
const employeeRoutes = employeeController.router;

export default employeeRoutes;
