import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
// import { Room } from './schema/room.schema';
import { Room } from './interface/room.interface';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { Query } from 'express-serve-static-core';
import { UnreadMessagesService } from 'src/unread_messages/unread_messages.service';
// import { RoomUsersService } from 'src/room_users/room_users.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel('Room') private roomModel: Model<Room>,
    private unreadMessages: UnreadMessagesService,
    // private roomUserService: RoomUsersService,
  ) {}
  // create new room
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    console.log('inside room service');
    const existRoom = await this.roomModel
      .findOne({
        user_id: createRoomDto.user_id,
        my_id: createRoomDto.my_id,
      })
      .exec();
    if (existRoom) {
      console.log('room already exist', existRoom.toJSON());
      return existRoom.toJSON();
    } else {
      // new group
      if (createRoomDto.isGroup) {
        const existGroup = await this.roomModel
          .findOne({
            image: createRoomDto.image,
            name: createRoomDto.name,
          })
          .exec();
        if (existGroup) return existGroup.toJSON();
        else return await this.roomModel.create(createRoomDto);
      }

      const originalUserRoom = await this.getSingleRoom(createRoomDto.user_id);

      // new dm
      if (originalUserRoom && !createRoomDto.isGroup) {
        const newObject = {
          ...createRoomDto,
          original_dm_roomID: originalUserRoom.id,
        };
        const newRoom = new this.roomModel(newObject);
        return (await newRoom.save()).toJSON();
      } else if (!originalUserRoom) {
        // new user
        const newRoom = new this.roomModel(createRoomDto);
        return (await newRoom.save()).toJSON();
      }
    }
  }

  // get all rooms in the room table
  async getAllRooms(): Promise<Room[]> {
    const allRooms = await this.roomModel.find().exec();
    return allRooms;
  }
  // find one room by id
  async getSingleRoom(id: string): Promise<Room> {
    return await this.roomModel.findOne({ user_id: id, my_id: '' }).exec();
  }

  // find room by my_id

  async fetchAllRooms(id: string): Promise<Room[]> {
    console.log('Fetching all rooms for id: ' + id);
    return await this.roomModel.find({ my_id: id, isGroup: false }).exec();
  }

  // find One room by id and update
  async updateRoom(id: string, update: UpdateRoomDto): Promise<Room> {
    console.log('update from roomService', update);
    return await this.roomModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  }
  // delete room
  async deleteRoom(id: string, myId: string) {
    const newId = new mongoose.Types.ObjectId(id);
    console.log('id from roomservice', newId);
    console.log('myId from roomservice', myId);
    return await this.roomModel.findOneAndDelete({ _id: newId, my_id: myId });
  }

  // find all groups objects in which a user belongs to

  async getAllGroupsOfSingleUser(userId: string) {
    // const groupsId = await this.roomUserService.findAllGroupsId(userId);
    // const allGrps: any[] = groupsId.map(async (group) => {
    //   const newId = new mongoose.Types.ObjectId(group.room_id);
    //   const grpArr = await this.roomModel
    //     .findOne({ isGroup: true, _id: newId })
    //     .exec();
    //   return grpArr;
    // });
    // return Promise.all(allGrps);
  }

  async getAllGroups() {
    const allgroups = await this.roomModel.find({
      isGroup: true,
    });
    if (allgroups) {
      return allgroups?.map((group) => group.id);
    }
    return [];
  }

  //Get a single user
  async fetchOneRoom(id: string) {
    // console.log('inside fetchOneRoom: ', id);
    if (id) {
      const singleRoom = await this.roomModel
        .findById(new mongoose.Types.ObjectId(id))
        .exec();
      // console.log(singleRoom);
      if (singleRoom) return singleRoom.toJSON();
    } else return null;
  }
}
