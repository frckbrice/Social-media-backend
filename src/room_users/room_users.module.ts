import { Module } from '@nestjs/common';
import { RoomUsersService } from './room_users.service';
import { RoomUsersController } from './room_users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomUser, RoomUserSchema } from './schema/roomUser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: RoomUser.name, schema: RoomUserSchema}])
  ],
  controllers: [RoomUsersController],
  providers: [RoomUsersService],
})
export class RoomUsersModule {}
