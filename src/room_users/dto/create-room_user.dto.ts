import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateRoomUserDto {
  save():
    | import('src/room_users/schema/roomUser.schema').RoomUser
    | PromiseLike<import('src/room_users/schema/roomUser.schema').RoomUser> {
    throw new Error('Method not implemented.');
  }
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  group_id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['member', 'admin'])
  role: string;
}
