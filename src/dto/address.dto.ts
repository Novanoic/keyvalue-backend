import { IsNotEmpty, IsString } from "class-validator";

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  line: string;

  @IsNotEmpty()
  @IsString({ message: "The pincode is not a string yo" })
  pincode: string;
}
