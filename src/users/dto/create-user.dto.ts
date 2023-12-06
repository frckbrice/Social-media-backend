import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  wsId: string

  @IsString()
  @IsOptional()
  about: string

}
