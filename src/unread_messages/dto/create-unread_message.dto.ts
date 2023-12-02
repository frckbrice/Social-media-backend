import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUnreadMessageDto {
  @IsNumber()
  @IsNotEmpty()
  unread_count: number;

  @IsString()
  @IsNotEmpty()
  last_message: string;

  @IsNotEmpty()
  @IsString()
  sender_id: string;

  @IsNotEmpty()
  @IsString()
  receiver_room_id: string;
}
