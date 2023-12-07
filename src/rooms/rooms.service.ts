import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './schema/room.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  // create new room
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new this.roomModel(createRoomDto);
    console.log('payload from service', newRoom);
    return await newRoom.save();
  }

  // get all rooms in the room table
  async getAllRooms(): Promise<Room[]> {
    const allRooms = await this.roomModel.find();
    return allRooms;
  }

  // find one room by id
  async getSingleRoom(id: string): Promise<Room> {
    const singleRoom = await this.roomModel.findById(id);
    if (!singleRoom) {
      throw new NotFoundException('No room with such id');
    }
    return singleRoom;
  }

  // find One room by id and update
  async updateRoom(id: string, update: UpdateRoomDto): Promise<Room> {
    return await this.roomModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  }

  // delete room
  async deleteRoom(id: string) {
    return await this.roomModel.findByIdAndDelete(id);
  }
}
