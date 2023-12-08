import { Module } from '@nestjs/common';
import { UnreadMessagesService } from './unread_messages.service';
import { UnreadMessagesController } from './unread_messages.controller';
import {
  UnreadMessage,
  UnreadMessageSchema,
} from './schema/unread_messages.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UnreadMessage.name, schema: UnreadMessageSchema },
    ]),
  ],
  controllers: [UnreadMessagesController],
  providers: [UnreadMessagesService],
  exports: [UnreadMessagesService],
})
export class UnreadMessagesModule {}
