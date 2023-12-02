import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateRoomUserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  room_id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['member', 'admin'])
  role: string;
}
