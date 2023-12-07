import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/interface/room.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private roomService: RoomsService,
  ) {}

  // create new user
  async create(createUserDto: CreateUserDto): Promise<Room> {
    const createdUser = new this.userModel(createUserDto);

    const email = createdUser.email;
    console.log('Payload from service', email);
    const existEmail = await this.userModel.findOne({ email: email }).exec();

    console.log('this is my user', existEmail);
    if (existEmail) {
      const existRoom = await this.roomService.createRoom({
        name: '',
        image: '',
        isGroup: false,
        user_id: existEmail.id,
        my_id: '',
      });
      if (existRoom) {
        console.log('email already exist');
        console.log('this is my object', existRoom);
        return existRoom;
      }
    }
    const user = await createdUser.save();
    const id = JSON.stringify(user.id);
    const newRoom: Room = {
      name: user.name,
      image: user.image,
      isGroup: false,
      user_id: id,
      my_id: '',
    };

    const newRoomUser: Room = await this.roomService.createRoom(newRoom);
    return newRoomUser;
  }

  // find all users
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  // find single room by id
  async findById(id: string): Promise<User> {
    const singleUser = await this.userModel.findById(id);

    if (!singleUser) {
      throw new NotFoundException('No existing user with that id');
    }
    return singleUser;
  }

  // update the user by id
  async updateUserInfo(id: string, update: UpdateUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidator: true,
    });
  }
}
