import { UpdateResult } from "typeorm";
import Department from "../entity/department.entity";
import { DepartmentRepository } from "../repository/department.repository";
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

export class DepartmentService {
  constructor(private departmentrepository: DepartmentRepository) {}

  getAllDepartments = (): Promise<Department[]> => {
    return this.departmentrepository.find();
  };

  getDepartmentById = (id: number): Promise<Department | null> => {
    return this.departmentrepository.findOneBy({ id });
  };

  getDepartmentByName = (name: string): Promise<Department | null> => {
    return this.departmentrepository.findOneBy({ name });
  };

  createDepartment = async (name: string): Promise<Department> => {
    const newDepartment = new Department();
    newDepartment.name = name;

    return this.departmentrepository.create(newDepartment);
  };

  deleteDepartment = async (id: number): Promise<UpdateResult> => {
    const department = await this.departmentrepository.findOneBy({ id });
    return this.departmentrepository.removeBy(department);
  };

  removeDepartment = async (id: number): Promise<Department> => {
    const department = await this.departmentrepository.findOneBy({ id });
    return this.departmentrepository.softRemove(department);
  };

  updateDepartment = async (id: number, name: string): Promise<Department> => {
    const department = await this.departmentrepository.findOneBy({ id });
    department.name = name;

    return this.departmentrepository.create(department);
  };
}
