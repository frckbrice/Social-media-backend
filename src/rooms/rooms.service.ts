import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
// import { Room } from './schema/room.schema';
import { Room } from './interface/room.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { Query } from 'express-serve-static-core';

@Injectable()
export class RoomsService {
  constructor(@InjectModel('Room') private roomModel: Model<Room>) {}
  // create new room
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const existRoom = await this.roomModel
      .findOne({
        user_id: createRoomDto.user_id,
        my_id: createRoomDto.my_id,
      })
      .exec();
    if (existRoom) {
      console.log('room already exist', existRoom.toJSON());

      return existRoom.toJSON();
    }
    const originalUserRoom = await this.getSingleRoom(createRoomDto.user_id);
    console.log(originalUserRoom);
    const newObject = {
      ...createRoomDto,
      original_dm_roomID: originalUserRoom.id,
    };
    const newRoom = new this.roomModel(newObject);
    console.log('payload from service', newRoom);
    return (await newRoom.save()).toJSON();
  }
  // get all rooms in the room table
  async getAllRooms(): Promise<Room[]> {
    const allRooms = await this.roomModel.find().exec();
    return allRooms;
  }
  // find one room by id
  async getSingleRoom(id: string): Promise<Room> {
    const singleRoom = await this.roomModel
      .findOne({ user_id: id, my_id: '' })
      .exec();
    if (!singleRoom) {
      throw new NotFoundException('No room with such id');
    }
    return singleRoom;
  }
  // find room by my_id
  async findByMyId(id: string): Promise<Room[]> {
    const allRooms = await this.roomModel.find({ my_id: id }).exec();
    console.log('these are all rooms', allRooms);

    if (allRooms.length < 1) {
      throw new NotFoundException('No room has this raw my_id');
    }
    return allRooms;
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
  // search for single room by query
  // async searchAll(query: Query): Promise<{}> {
  //   console.log('this is query', query);
  //   const keyword = query.keyword
  //     ? {
  //         name: {
  //           $regex: query.keyword,
  //           $options: 'i',
  //         },
  //       }
  //     : {};
  //   const searchedRoom = await this.roomModel.find({ ...keyword });
  //   return searchedRoom;
  // }
}
