import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/users.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  // get all users
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  // get a single user by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  // post new user
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // console.log('Payload from controller', createUserDto)
    return this.userService.create(createUserDto);
  }

  // update a user by id
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userUpdate: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserInfo(id, userUpdate);
  }

  // @Delete(':id')
  // findOne(@Param('id') id: string) {
  //   return { id }
  // }
}
