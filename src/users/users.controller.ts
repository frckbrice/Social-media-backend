import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './schemas/users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService){}


  @Get()
  findAll() {
    return []
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id }
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userupdate: {}) {
    return { id, ...userupdate }
  }

  // @Delete(':id')
  // findOne(@Param('id') id: string) {
  //   return { id }
  // }
}
