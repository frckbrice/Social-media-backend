import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

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

  @IsString()
  about: string

  @IsObject()
  user_metadata: Object

  @IsString()
  picture: string
}
