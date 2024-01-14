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
  async create(createUserDto: CreateUserDto): Promise<any> {
    const email = createUserDto.email;
    const existEmail = await this.userModel.findOne({ email: email }).exec();

    console.log('this is my user', existEmail);
    if (existEmail) {
      const existRoom: Room = await this.roomService.createRoom({
        name: existEmail?.name,
        image: existEmail?.image,
        isGroup: false,
        user_id: existEmail?.id.toString(),
        my_id: '',
        // original_dm_roomID: '',
      });
      if (existRoom) {
        // console.log('email already exist', existRoom);

        return { ...existRoom, phone: existEmail?.phone };
      }
    }
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();

    const id = user.id.toString();
    if (user) {
      const newRoom: Room = {
        name: user?.name,
        image: user?.image,
        isGroup: false,
        user_id: id,
        my_id: '',
        original_dm_roomID: '',
      };
      const newRoomUser: Room = await this.roomService.createRoom(newRoom);
      return { ...newRoomUser, phone: user?.phone };
    }
  }

  // find all users
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  // find single room by id
  async findById(id: string): Promise<User> {
    const newId = new mongoose.Types.ObjectId(id);
    const singleUser = await this.userModel.findById(newId);

    if (!singleUser) {
      throw new NotFoundException('No existing user with that id');
    }
    return singleUser;
  }

  // update the user by id
  async updateUserInfo(id: string, update: UpdateUserDto): Promise<User> {
    const newId = new mongoose.Types.ObjectId(id);
    return await this.userModel.findByIdAndUpdate({ _id: newId }, update, {
      new: true,
      runValidator: true,
    });
  }
}
