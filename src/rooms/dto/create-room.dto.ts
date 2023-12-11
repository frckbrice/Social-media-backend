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
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  my_id: string;

  @IsString()
  @IsOptional()
  original_dm_roomID?: string;
}
