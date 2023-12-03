import {IsEmail, IsNotEmpty, IsString} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  image: string;

  @IsString()
  phone: string;

  @IsString()
  wsId: string

}
