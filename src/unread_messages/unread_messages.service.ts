import { Injectable } from '@nestjs/common';

import { UpdateUnreadMessageDto } from './dto/update-unread_message.dto';
import { InjectModel } from '@nestjs/mongoose';
// import { UnreadMessage } from './schema/unread_messages.schema';
import { UnreadMessage } from './interface/unread_messages.interface';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UnreadMessagesService {
  constructor(
    @InjectModel('UnreadMessage')
    private unreadMessage: Model<UnreadMessage>,
  ) {}

  async createUnreadMessage(data: {
    sender_id: string;
    receiver_room_id: string;
    last_message: string;
    currentUser?: string;
    // unread_count: number;
  }): Promise<UnreadMessage> {
    console.log('data from message srvice', data);
    try {
      const existingUnreadMessage = await this.findOneUnreadMessage({
        sender_id: data.sender_id,
        receiver_room_id: data.receiver_room_id,
      });
      if (existingUnreadMessage) {
        console.log('unread message exist: ', data);
        if (data.receiver_room_id !== data.currentUser) {
          await this.update(data.sender_id, data.receiver_room_id, {
            unread_count: existingUnreadMessage.unread_count + 1,
            last_message: data.last_message,
          });
        } else {
          await this.update(data.sender_id, data.receiver_room_id, {
            unread_count: 0,
            last_message: data.last_message,
          });
        }
      } else {
        console.log('unread message not exist: ', data);
        await this.unreadMessage.create({
          sender_id: data.sender_id,
          receiver_room_id: data.receiver_room_id,
          last_message: data.last_message,
          unread_count: 1,
        });
      }
    } catch (error) {
      if (error instanceof Error) console.log('error creating messages', error);
      return Promise.reject(error);
    }
  }

  async findAll(): Promise<UnreadMessage[]> {
    return await this.unreadMessage.find().exec();
  }

  async findOneUnreadMessage(data: {
    sender_id: string;
    receiver_room_id: string;
  }): Promise<any> {
    return await this.unreadMessage.findOne({
      sender_id: data.sender_id,
      receiver_room_id: data.receiver_room_id,
    });
  }

  update(
    sender_id: string,
    receiver_room_id: string,
    value: UpdateUnreadMessageDto,
  ) {
    return this.unreadMessage.findOneAndUpdate(
      {
        sender_id: sender_id,
        receiver_room_id: receiver_room_id,
      },
      { unread_count: value.unread_count, last_message: value.last_message },
    );
  }

  async remove(sender_id: string, receiver_room_id: string) {
    console.log('inside unread message remove');
    const value = await this.unreadMessage.findOne({
      sender_id: new mongoose.Types.ObjectId(sender_id),
      receiver_room_id: new mongoose.Types.ObjectId(receiver_room_id),
    });

    if (value) {
      value.unread_count = 0;
      await value.save();
    }
  }
}
