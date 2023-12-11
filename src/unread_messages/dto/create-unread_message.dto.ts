import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUnreadMessageDto {
  @IsNumber()
  @IsOptional()
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
