import { DataSource, FindOptionsWhere, Repository } from "typeorm";
import dataSource from "../db/data-source.db";
import Department from "../entity/department.entity";

export class DepartmentRepository {
  constructor(private repository: Repository<Department>) {}

  find = async () => {
    return this.repository.find({ relations: ["employee"] });
  };

  findOneBy = async (filter: Partial<Department>) => {
    return this.repository.findOne({ where: filter, relations: ["employee"] });
  };

  create = async (newDepartment: Partial<Department>) => {
    return this.repository.save(newDepartment);
  };

  removeBy = async (filter: FindOptionsWhere<Department>) => {
    return this.repository.softDelete(filter);
  };

  softRemove = async (department: Department) => {
    return this.repository.softRemove(department);
  };
}
