import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthenticationDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString({ message: "The pincode is not a string yo" })
  password: string;
}
