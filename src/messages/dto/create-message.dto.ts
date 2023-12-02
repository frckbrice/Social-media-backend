import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Room } from 'src/rooms/schema/room.schema';
import { User } from 'src/users/schemas/users.schema';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  sender_id: User;

  @IsNotEmpty()
  @IsString()
  receiver_room_id: Room;

  @IsOptional()
  @IsString()
  sender_name: string;

  @IsString()
  @IsOptional()
  sender_phone: string;

  @IsString()
  @IsOptional()
  reaction: string;
}
