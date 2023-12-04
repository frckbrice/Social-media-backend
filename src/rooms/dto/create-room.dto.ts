import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsNotEmpty()
  isGroup: boolean;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
