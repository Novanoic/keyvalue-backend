import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  RoleSpecification,
  UpdateDateColumn,
} from "typeorm";

import AbstractEntity from "./abstract-entity";
import Address from "./address.entity";
import { Role } from "../utils/role.enums";

@Entity()
class Employee extends AbstractEntity {
  @Column()
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

  @Column({ nullable: true })
  role: Role;

  @Column({ nullable: true })
  password: string;
}

export default Employee;
