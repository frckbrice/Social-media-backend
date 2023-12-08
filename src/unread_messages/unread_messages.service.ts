import { Injectable } from '@nestjs/common';
import { CreateUnreadMessageDto } from './dto/create-unread_message.dto';
import { UpdateUnreadMessageDto } from './dto/update-unread_message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UnreadMessage } from './schema/unread_messages.schema';
import { Model } from 'mongoose';

@Injectable()
export class UnreadMessagesService {
  constructor(
    @InjectModel(UnreadMessage.name)
    private unreadMessage: Model<UnreadMessage>,
  ) {}

  async createUnreadMessage(data: any): Promise<UnreadMessage> {
    try {
      const message = await this.unreadMessage
        .findOneAndUpdate(
          {
            sender_id: data.sender_id,
            receiver_room_id: data.receiver_room_id,
          },
          { $inc: { unread_count: 1 }, last_message: data.last_message },
          { new: true },
        )
        .exec();
      return message;
    } catch (error) {
      if (error instanceof Error) console.log('error creating messages', error);
      return Promise.reject(error);
    }
  }

  findAll() {
    return `This action returns all unreadMessages`;
  }

  async findOneUnreadMessage(data: any): Promise<number> {
    return await this.unreadMessage.findOne({
      sender_id: data.sender_id,
      receiver_room_id: data.receiver_room_id,
    });
  }

  update(id: number, data: UpdateUnreadMessageDto) {
    return `This action updates a #${id} unreadMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} unreadMessage`;
  }
}
