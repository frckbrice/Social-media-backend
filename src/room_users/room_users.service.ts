import { Injectable } from '@nestjs/common';
import { CreateRoomUserDto } from './dto/create-room_user.dto';
import { UpdateRoomUserDto } from './dto/update-room_user.dto';

@Injectable()
export class RoomUsersService {
  create(createRoomUserDto: CreateRoomUserDto) {
    return 'This action adds a new roomUser';
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
