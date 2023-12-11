import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomUserDto } from './create-room_user.dto';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateRoomUserDto extends PartialType(CreateRoomUserDto) {
  @IsString()
  @IsOptional()
  @IsIn(['member', 'admin'])
  role: string;
}
