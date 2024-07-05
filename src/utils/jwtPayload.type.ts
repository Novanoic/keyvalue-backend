import { Role } from "./role.enums";

export type jwtPayload = {
  name: string;
  email: string;
  role: Role;
};
