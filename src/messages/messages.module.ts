import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessageSchema } from './schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UnreadMessagesModule } from 'src/unread_messages/unread_messages.module';
import { RoomUsersModule } from 'src/room_users/room_users.module';

@Module({
  imports: [
    RoomsModule,
    UnreadMessagesModule,
    RoomUsersModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
