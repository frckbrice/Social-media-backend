import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomUsersService } from './room_users.service';
import { CreateRoomUserDto } from './dto/create-room_user.dto';
import { UpdateRoomUserDto } from './dto/update-room_user.dto';

@Controller('room-users')
export class RoomUsersController {
  constructor(private readonly roomUsersService: RoomUsersService) {}

  @Post()
  create(@Body() createRoomUserDto: CreateRoomUserDto) {
    return this.roomUsersService.create(createRoomUserDto);
  }

  @Get()
  findAll() {
    return this.roomUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomUserDto: UpdateRoomUserDto) {
    return this.roomUsersService.update(+id, updateRoomUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomUsersService.remove(+id);
  }
}
