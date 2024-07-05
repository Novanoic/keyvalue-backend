import { Role } from "./role.enums";
import { Request } from "express";

export interface RequestWithUser extends Request {
  name: string;
  email: string;
  role: Role;
}
