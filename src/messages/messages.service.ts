import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
// import { Message } from './schema/message.schema';
import { Message } from './interface/messages.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    if (
      !createMessageDto.sender_id ||
      !createMessageDto.receiver_room_id ||
      !createMessageDto.content
    )
      return Promise.reject(
        ' Need sender , receiver and content to send the message',
      );
    try {
      const createdMessage = await this.messageModel.create(createMessageDto);
      return createdMessage;
    } catch (error) {
      if (error instanceof Error) console.log('error creating messages', error);
      return Promise.reject(error);
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  async getMessages(
    sender_room_id: string,
    receiver_room_id: string,
  ): Promise<Message[]> {
    try {
      const messages = await this.messageModel
        .find({
          $or: [
            { sender_room_id, receiver_room_id },
            {
              sender_room_id: receiver_room_id,
              receiver_room_id: sender_room_id,
            },
          ],
        })
        .sort('timestamp')
        .exec();
      return messages;
    } catch (error) {
      if (error instanceof Error) console.log('error getting messages', error);
      return Promise.reject(error);
    }
  }

  async updateMessage(
    messageId: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const id = new mongoose.Types.ObjectId(messageId);
    try {
      const updatedMessage = await this.messageModel.findById(id);
      if (updatedMessage) {
        if (typeof updateMessageDto === 'boolean')
          updatedMessage.is_read = updateMessageDto;
        else if (typeof updateMessageDto === 'string')
          updatedMessage.reaction = updateMessageDto;
      }
      return updatedMessage.save();
    } catch (error) {
      if (error instanceof Error) console.log('error updating messages', error);
      return Promise.reject(error);
    }
  }

  async getGroupMessage(groupId: string): Promise<Message[]> {
    try {
      const allGroupMessages = await this.messageModel
        .find({ receiver_room_id: groupId })
        .sort('timestamp')
        .exec();
      return allGroupMessages;
    } catch (error) {
      if (error instanceof Error)
        console.log('error finding allgroupmessages', error);
      return Promise.reject(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
