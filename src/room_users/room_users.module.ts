import { Module } from '@nestjs/common';
import { RoomUsersService } from './room_users.service';
import { RoomUsersController } from './room_users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomUser, RoomUserSchema } from './schema/roomUser.schema';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UnreadMessagesModule } from 'src/unread_messages/unread_messages.module';

@Module({
  imports: [
    RoomsModule,
    MongooseModule.forFeature([
      { name: RoomUser.name, schema: RoomUserSchema },
    ]),
    UnreadMessagesModule,
  ],
  controllers: [RoomUsersController],
  providers: [RoomUsersService],
  exports: [RoomUsersService],
})
export class RoomUsersModule {}
