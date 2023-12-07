import { Injectable } from '@nestjs/common';
import { CreateUnreadMessageDto } from './dto/create-unread_message.dto';
import { UpdateUnreadMessageDto } from './dto/update-unread_message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UnreadMessage } from './schema/unread_messages.schema';
import {Model} from "mongoose"

@Injectable()
export class UnreadMessagesService {
  constructor(@InjectModel(UnreadMessage.name) private unreadMessage: Model<UnreadMessage>) {}

   async create(createUnreadMessageDto: CreateUnreadMessageDto): Promise<UnreadMessage> {
    const message = new this.unreadMessage(createUnreadMessageDto)
    return await message.save();
  }

  findAll() {
    return `This action returns all unreadMessages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} unreadMessage`;
  }

  update(id: number, updateUnreadMessageDto: UpdateUnreadMessageDto) {
    return `This action updates a #${id} unreadMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} unreadMessage`;
  }
}
