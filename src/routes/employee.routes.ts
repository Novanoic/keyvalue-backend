import EmployeeController from "../controller/employee.controller";
import dataSource from "../db/data-source.db";
import Department from "../entity/department.entity";
import Employee from "../entity/employee.entity";
import { DepartmentRepository } from "../repository/department.repository";
import { EmployeeRepository } from "../repository/employee.repository";
import { DepartmentService } from "../service/department.service";
import { EmployeeService } from "../service/employee.service";

const employeeController = new EmployeeController(
  new EmployeeService(
    new EmployeeRepository(dataSource.getRepository(Employee)),
    new DepartmentService(
      new DepartmentRepository(dataSource.getRepository(Department))
    )
  )
);
const employeeRoutes = employeeController.router;

export default employeeRoutes;
