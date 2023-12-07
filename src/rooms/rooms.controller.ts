import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './schema/room.schema';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // Post rooms
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    console.log('this is room from body', createRoomDto)
    return this.roomsService.createRoom(createRoomDto);
  }

  // find all rooms
  @Get()
  async findAllRooms(): Promise<Room[]> {
    return await this.roomsService.getAllRooms();
  }

  // find single room
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.getSingleRoom(id);
  }

  // update single room
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roomsService.deleteRoom(id);
  }
}
