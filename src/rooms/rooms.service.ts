import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './schema/room.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomUsersService } from 'src/room_users/room_users.service';
// import { Query } from 'express-serve-static-core';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    private roomUserService: RoomUsersService,
  ) { }

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
    const newRoom = new this.roomModel(createRoomDto);
    console.log('payload from service', newRoom);
    return (await newRoom.save()).toJSON();
  }

  // get all rooms in the room table
  async getAllRooms(): Promise<Room[]> {
    const allRooms = await this.roomModel.find();
    return allRooms;
  }
  // find one room by id
  async getSingleRoom(id: string): Promise<Room> {
    const singleRoom = await this.roomModel.findOne({ user_id: id });
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
    console.log('update from roomService', update)
    return await this.roomModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  }
  // delete room
  async deleteRoom(id: string, myId: string) {
    const newId = new mongoose.Types.ObjectId(id)
    console.log('id from roomservice', newId)
    console.log('myId from roomservice', myId)
    return await this.roomModel.findOneAndDelete({ _id: newId, my_id: myId });
  }

  // find all groups objects in which a user belongs to
  async getAllGroupsOfSingleUser(userId: string): Promise<Room[]> {
    const groupsId = await this.roomUserService.findAllGroupsId(userId)
    const groups: any[] = []
    let finalGrps: any[] []
    const allGrps: any[] = groupsId.map(async(group) => {
      
      const newId = new mongoose.Types.ObjectId(group.room_id)
      const grpArr = await this.roomModel.findOne({ isGroup: true, _id: newId }).exec()
      // console.log('here is group:', grpArr)
      // console.log('groups: ', groups)
      if (grpArr) {
        groups.push(grpArr)
        console.log('groups: ', groups)
      }
      finalGrps = groups
      console.log('my groups: ', finalGrps)
      return groups
    })
    console.log('array of groups', finalGrps)
    if (typeof allGrps) {
      console.log('array of groups in if', allGrps)
      return allGrps
    }
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
