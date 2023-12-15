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
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roomUsersService.findAllGroupsId(id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomUserDto: UpdateRoomUserDto,
  ) {
    return this.roomUsersService.update(+id, updateRoomUserDto);
  }

  // remove a group participant
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomUsersService.removeParticipant(id);
  }

  // find rooms with my_id
  @Get('/my_dm/:id')
  async findOneByMyId(@Param('id') id: string) {
    const resChats = await this.roomUsersService.getAllGroupAndDM(id);
    console.log('res chats', resChats);
    return resChats;
  }

  // GET ALL PARTICIPANTS IN A GROUPS
  @Get('/all_participants/:id')
  async getGroupmemebers(@Param('id') id: string) {
    return (await this.roomUsersService.getAllGroupMembers(id))[1];
  }
}
