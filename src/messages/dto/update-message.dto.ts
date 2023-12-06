import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsString()
  @IsOptional()
  reaction: string;

  @IsBoolean()
  @IsOptional()
  is_read: boolean;
}
