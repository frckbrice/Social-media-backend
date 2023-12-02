import { Module } from '@nestjs/common';
import { RoomUsersService } from './room_users.service';
import { RoomUsersController } from './room_users.controller';

@Module({
  controllers: [RoomUsersController],
  providers: [RoomUsersService],
})
export class RoomUsersModule {}
