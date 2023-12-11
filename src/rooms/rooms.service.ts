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
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { Query } from 'express-serve-static-core';
import { UnreadMessagesService } from 'src/unread_messages/unread_messages.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel('Room') private roomModel: Model<Room>,
    private unreadMessages: UnreadMessagesService,
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
      const originalUserRoom = await this.checkExisting(createRoomDto.user_id);

      // not group case
      if (originalUserRoom && !createRoomDto.isGroup) {
        const newObject = {
          ...createRoomDto,
          original_dm_roomID: originalUserRoom.id,
        };
        const newRoom = new this.roomModel(newObject);

        return (await newRoom.save()).toJSON();
      }
      // group case
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

  // find one room by id
  async checkExisting(id: string): Promise<Room> {
    const singleRoom = await this.roomModel.findOne({ user_id: id }).exec();
    if (!singleRoom) {
      return singleRoom;
    }
  }
  // find room by my_id
  async findByMyId(id: string): Promise<Room[]> {
    try {
      const allRooms = await this.roomModel.find({ my_id: id }).exec();
      console.log('these are all rooms', allRooms);

      const [allUnreadMessages, myRoomID] = await Promise.all([
        await this.unreadMessages.findAll(),
        await this.getSingleRoom(id),
      ]);

      if (allUnreadMessages && myRoomID) {
        const listToReturn = allUnreadMessages?.reduce(
          (acc, curr) => {
            acc = acc?.map((item: any) =>
              item.original_dm_roomID === curr.sender_id.toString() &&
              curr?.receiver_room_id.toString() === myRoomID.toString()
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

        return listToReturn;
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

  async getAllGroups() {
    const allgroups = await this.roomModel.find({
      isGroup: true,
    });
    if (allgroups) {
      return allgroups?.map((group) => group.id);
    }
    return [];
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
