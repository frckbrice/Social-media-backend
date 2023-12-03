import { Module } from '@nestjs/common';
import { Room, RoomSchema } from './schemas/rooms.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]) 
  ],
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule { }
