import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      console.log('Payload from roomservice b4 else if', createRoomDto);
      if (createRoomDto.isGroup) {
        console.log('Payload from roomservice in else if', createRoomDto);
        const newRoom = await this.roomModel.create(createRoomDto);

        return newRoom;
      }
      console.log('Payload from roomservice after else if', createRoomDto);
      const originalUserRoom = await this.getSingleRoom(createRoomDto.user_id);

      // new dm
      if (originalUserRoom && !createRoomDto.isGroup) {
        const newObject = {
          ...createRoomDto,
          original_dm_roomID: originalUserRoom.id,
        };
        const newRoom = new this.roomModel(newObject);
        return (await newRoom.save()).toJSON();
      }
      // new user
      const newRoom = new this.roomModel(createRoomDto);
      return (await newRoom.save()).toJSON();
    }
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
    try {
      const [allUnreadMessages, myRoomID, allRooms] = await Promise.all([
        await this.unreadMessages.findAll(),
        await this.getSingleRoom(id),
        await this.roomModel.find({ my_id: id }).exec(),
      ]);

      if (allUnreadMessages && myRoomID) {
        return allUnreadMessages?.reduce(
          (acc, curr) => {
            acc = acc?.map((item: any) =>
              item.original_dm_roomID === curr.sender_id.toString() &&
              curr?.receiver_room_id.toString() === myRoomID.id.toString()
                ? {
                    ...item,
                    unread_count: curr?.unread_count,
                    last_message: curr?.last_message,
                    updatedAt: curr?.updatedAt,
                  }
                : item,
            );
            return acc;
          },
          [...allRooms],
        );
      }
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'some thing went wrong',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          { cause: { message: 'some thing went wrong' } },
        );
    }
  }

  async fetchAllRooms(id: string) {
    return await this.roomModel.find({ my_id: id }).exec();
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
  async fetchOneRoom(id: string): Promise<Room> {
    console.log('inside fetchOneRoom: ', id);
    if (id) {
      const singleRoom = await this.roomModel
        .findById(new mongoose.Types.ObjectId(id))
        .exec();
      // console.log(singleRoom);
      if (singleRoom) return singleRoom.toJSON();
    } else return null;
  }
}
