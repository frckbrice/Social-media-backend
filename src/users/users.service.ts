import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  // create new user
  async create(createUserDto: CreateUserDto): Promise<User> {

    const createdUser = new this.userModel(createUserDto);
    
    const email = createdUser.email
    console.log('Payload from service', email)
    const existEmail = await this.userModel.findOne({ email: email }).exec()

    console.log('this is my user', existEmail)
    if (existEmail) {
      console.log("email already exist")
      console.log('this is my object', existEmail)
      return existEmail
    }
    return await createdUser.save();
  }

  // find all users
  async findAll(): Promise<User[]> {
    const users = await this.userModel.find()
    return users;
  }

  // find single room by id
  async findById(id: string): Promise<User> {
    const singleUser = await this.userModel.findById(id)

    if (!singleUser) {
      throw new NotFoundException('No existing user with that id')
    }
    return singleUser
  }

  // update the user by id
  async updateUserInfo(id: string, update: UpdateUserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidator: true
    })
  }
}
