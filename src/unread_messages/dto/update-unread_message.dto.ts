import { PartialType } from '@nestjs/mapped-types';
import { CreateUnreadMessageDto } from './create-unread_message.dto';

export class UpdateUnreadMessageDto extends PartialType(CreateUnreadMessageDto) {}
