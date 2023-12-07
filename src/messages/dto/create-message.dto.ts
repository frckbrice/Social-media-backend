import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  sender_id: string;

  @IsNotEmpty()
  @IsString()
  receiver_room_id: string;

  @IsOptional()
  @IsString()
  sender_name: string;

  @IsString()
  @IsOptional()
  sender_phone: string;

  @IsString()
  @IsOptional()
  reaction: string;

  @IsBoolean()
  @IsNotEmpty()
  is_read: boolean;
}
