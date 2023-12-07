import { IsBoolean, IsString } from "class-validator";

export class CreateRoomDto {
  @IsString()
  name: string

  @IsString()
  image: string

  @IsBoolean()
  status: boolean

  @IsString()
  user_id: string
  
}