import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomUsersService } from './room_users.service';
import { CreateRoomUserDto } from './dto/create-room_user.dto';
import { UpdateRoomUserDto } from './dto/update-room_user.dto';

@Controller('rooms_users')
export class RoomUsersController {
  constructor(private readonly roomUsersService: RoomUsersService) {}

  // Create new room-user
  @Post()
  async create(@Body() createRoomUserDto: CreateRoomUserDto) {
    console.log('from controller', createRoomUserDto);
    return await this.roomUsersService.create(createRoomUserDto);
  }

  // get all rooms-users
  @Get()
  findAll() {
    return this.roomUsersService.findAll();
  }

  // get all users per room id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomUsersService.findAllUsers(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomUserDto: UpdateRoomUserDto,
  ) {
    return this.roomUsersService.update(+id, updateRoomUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomUsersService.removeParticipant(id);
  }
}
