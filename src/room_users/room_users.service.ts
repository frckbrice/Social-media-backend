import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room_user.dto';
import { UpdateRoomUserDto } from './dto/update-room_user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RoomUser } from './schema/roomUser.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RoomUsersService {
  constructor(
    @InjectModel(RoomUser.name) private roomUserModel: Model<RoomUser>,
  ) {}

  // Post data in the roomUser table
  async create(createRoomUserDto: CreateRoomUserDto): Promise<RoomUser> {
    console.log('aprameter of fxn from service', createRoomUserDto);
    const createRoomUser = new this.roomUserModel(createRoomUserDto);
    console.log('this is roomuser from service', createRoomUser);
    return await createRoomUser.save();
  }

  // get all roomUsers
  async findAll(): Promise<RoomUser[]> {
    const roomUsers = await this.roomUserModel.find();
    return roomUsers;
  }

  // find users per room
  async findAllUsers(id: string): Promise<RoomUser[]> {
    const participants = await this.roomUserModel.find({
      room_id: id,
    });

    return participants;
  }

  // find all groups in which a user belongs to
  async findAllGroupsId (userId: string): Promise<RoomUser[]> {
    const groupsId = await this.roomUserModel.find({user_id: userId})
    return groupsId
  }

  // Update roomUser
  update(id: number, updateRoomUserDto: UpdateRoomUserDto) {
    return `This action updates a #${id} roomUser`;
  }

  // remove a group participant
  async removeParticipant(id: string) {
    return await this.roomUserModel.findOneAndDelete({
      user_id: id,
    });
  }

  // find one room by id
  async getGroupOfSingleUser(id: string): Promise<RoomUser> {
    const singleRoom = await this.roomUserModel.findOne({ user_id: id }).exec();
    if (!singleRoom) {
      throw new NotFoundException('No room with such id');
    }
    return singleRoom;
  }
}