import { PartialType } from '@nestjs/mapped-types';
import { CreateUnreadMessageDto } from './create-unread_message.dto';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
export class UpdateUnreadMessageDto extends PartialType(
  CreateUnreadMessageDto,
) {
  @IsNotEmpty()
  @IsNumber()
  unread_count: number;

  @IsNotEmpty()
  @IsString()
  last_message: string;
}
