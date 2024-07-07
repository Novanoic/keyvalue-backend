import {
  Collection,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import AbstractEntity from "./abstract-entity";
import Employee from "./employee.entity";

@Entity()
class Department extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employee: Employee[];
}

export default Department;
