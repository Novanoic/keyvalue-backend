import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  isEmail,
  isNotEmpty,
  minLength,
} from "class-validator";
import { CreateAddressDto } from "./address.dto";
import { CreateDepartmentDto } from "./department.dto";
import Address from "../entity/address.entity";
import { Type } from "class-transformer";
import "reflect-metadata";
import { Role } from "../utils/role.enums";
import { Status } from "../utils/status.enums";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  jdate: Date;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDepartmentDto)
  department: CreateDepartmentDto;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  experience: string;

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
