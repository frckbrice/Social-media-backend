import { Injectable } from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room_user.dto';
import { UpdateRoomUserDto } from './dto/update-room_user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RoomUser } from './schema/roomUser.schema';
import { Model } from 'mongoose';

@Injectable()
export class RoomUsersService {
  constructor(@InjectModel(RoomUser.name) private roomUserModel: Model<RoomUser>) {}


  async create(createRoomUserDto: CreateRoomUserDto): Promise<RoomUser> {
    const createRoomUser = new this.roomUserModel(createRoomUserDto)
    return await createRoomUser.save();
  }

  findAll() {
    return `This action returns all roomUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomUser`;
  }

  update(id: number, updateRoomUserDto: UpdateRoomUserDto) {
    return `This action updates a #${id} roomUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomUser`;
  }
}
