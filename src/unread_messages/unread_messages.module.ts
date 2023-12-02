import { Module } from '@nestjs/common';
import { UnreadMessagesService } from './unread_messages.service';
import { UnreadMessagesController } from './unread_messages.controller';

@Module({
  controllers: [UnreadMessagesController],
  providers: [UnreadMessagesService],
})
export class UnreadMessagesModule {}
