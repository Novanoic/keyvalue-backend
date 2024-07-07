import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RoleSpecification,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import AbstractEntity from "./abstract-entity";
import Address from "./address.entity";
import Department from "./department.entity";
import { Role } from "../utils/role.enums";

@Entity()
class Employee extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @OneToOne(() => Address, (address) => address.employee, {
    cascade: true,
    onDelete: "CASCADE",
  })
  address: Address;

  @ManyToOne(() => Department, (department) => department.employee)
  @JoinColumn({ name: "department_name", referencedColumnName: "name" })
  department: Department;

  @Column()
  role: Role;

  @Column()
  password: string;
}

export default Employee;
