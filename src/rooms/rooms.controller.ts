import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  // Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './interface/room.interface';
// import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // Post rooms
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    console.log('this is room from body', createRoomDto);
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
    console.log('from controller', updateRoomDto);
    return this.roomsService.updateRoom(id, updateRoomDto);
  }

  // delete single room
  @Delete(':id/:myId')
  async remove(@Param('id') id: string, @Param('myId') myId: string) {
    console.log('from roomcontroller', id);
    return await this.roomsService.deleteRoom(id, myId);
  }

  // get all groups of one user
  @Get('/all_groups/:id')
  async getAllgroups(@Param('id') id: string) {
    return await this.roomsService.getAllGroupsOfSingleUser(id);
  }

  // find single room by name using query params
  // @Get()
  // async searchSingleRoom(@Query() query: ExpressQuery): Promise<{}> {
  //   console.log('from controller', query);
  //   return this.roomsService.searchAll(query);
  // }
}
