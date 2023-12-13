import { Module } from '@nestjs/common';
import { Room, RoomSchema } from './schema/room.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomUsersModule } from 'src/room_users/room_users.module';
import { UnreadMessagesModule } from 'src/unread_messages/unread_messages.module';

@Module({
  imports: [
    UnreadMessagesModule,
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
