import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
// import { Message } from './schema/message.schema';
import { Message } from './interface/messages.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UnreadMessagesService } from 'src/unread_messages/unread_messages.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomUsersService } from 'src/room_users/room_users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Message') private messageModel: Model<Message>,
    private unreadMessage: UnreadMessagesService,
    private roomService: RoomsService,
    private roomUserService: RoomUsersService,
  ) {}

  async createMessage(
    createMessageDto: CreateMessageDto,
    canProceed: string,
  ): Promise<Message> {
    if (
      !createMessageDto.sender_id ||
      !createMessageDto.receiver_room_id ||
      !createMessageDto.content
    )
      throw new HttpException(
        ' Need sender , receiver and content to send the message',
        HttpStatus.BAD_REQUEST,
      );
    try {
      const createdMessage = await this.messageModel.create(createMessageDto);
      console.log('value of can_proceed: ', canProceed);
      //activate the counter when the current user is not connected
      if (createdMessage)
        await this.unreadMessage.createUnreadMessage({
          sender_id: createdMessage.sender_id,
          receiver_room_id: createdMessage.receiver_room_id,
          last_message: createdMessage.content,
          currentUser: canProceed,
        });

      return createdMessage;
    } catch (error) {
      if (error instanceof Error) console.log('error creating messages', error);
      return Promise.reject(error);
    }
  }

  findAll() {
    return `This action returns all messages`;
  }

  async getb2bMessages(
    sender_id: string,
    receiver_room_id: string,
  ): Promise<Message[]> {
    console.log('inside get b2b message function', sender_id, receiver_room_id);
    if (sender_id && receiver_room_id) {
      await this.unreadMessage.remove(sender_id, receiver_room_id);
      try {
        const sentMessages = await this.getSentMessages(
          sender_id,
          receiver_room_id,
        );

        const receivedMessages = await this.getReceivedMessages(
          sender_id,
          receiver_room_id,
        );
        //reset unread messages to initial state
        // await this.unreadMessage.remove(sender_id, receiver_room_id);

        const messages = [...sentMessages, ...receivedMessages];
        // console.log('all messages', messages);

        return this.shuffleMessages(messages);
      } catch (error) {
        if (error instanceof Error)
          console.log('error getting messages', error);
        return Promise.reject(error);
      }
    } else console.log('no sender or receiver to find these messages');
  }

  async updateMessage(
    message_id: string,
    value: string | boolean,
  ): Promise<Message> {
    // const id = new mongoose.Types.ObjectId(messageId);
    if (message_id)
      try {
        const updatedMessage = await this.messageModel.findById({
          _id: new mongoose.Types.ObjectId(message_id),
        });
        if (updatedMessage) {
          if (typeof value === 'string') updatedMessage.reaction = value;
          else if (typeof value === 'boolean') updatedMessage.is_read = value;
          return (await updatedMessage.save()).toJSON();
        }
      } catch (error) {
        if (error instanceof Error)
          console.log('error updating messages', error);
        return Promise.reject(error);
      }
    else console.log('No message id found');
  }

  async markMessageAsRead(sender_id: string, receiver_room_id: string) {
    const senderID = new mongoose.Types.ObjectId(sender_id);
    const receivedID = new mongoose.Types.ObjectId(receiver_room_id);
    const message = await this.messageModel.updateMany(
      {
        sender_id: senderID,
        receiver_room_id: receivedID,
      },
      { is_read: true },
    );

    if (message) {
      console.log(message);
    } else throw new HttpException(' No such message', HttpStatus.NOT_FOUND);
  }

  async getGroupMessage(groupId: string, senderId: string): Promise<Message[]> {
    if (groupId && senderId) {
      try {
        await this.unreadMessage.remove(senderId, groupId);
        await this.markMessageAsRead(senderId, groupId);

        const allGroupMessages = await this.messageModel
          .find({
            receiver_room_id: new mongoose.Types.ObjectId(groupId),
          })
          .sort('createdAt DESC')
          .exec();
        if (allGroupMessages) return allGroupMessages;
        else
          throw new HttpException(
            'No such group messages',
            HttpStatus.NOT_FOUND,
          );
      } catch (error) {
        if (error instanceof Error)
          console.log('error fetching all group messages', error);
        throw new HttpException(
          'Error fetching all group messages',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async getSentMessages(
    sender_id: string,
    receiver_room_id: string,
  ): Promise<Message[]> {
    const senderID = new mongoose.Types.ObjectId(sender_id);
    const receivedID = new mongoose.Types.ObjectId(receiver_room_id);
    const sentMessages = await this.messageModel.find({
      sender_id: senderID,
      receiver_room_id: receivedID,
    });
    await this.markMessageAsRead(sender_id, receiver_room_id);
    if (sentMessages) {
      console.log(sentMessages);
      return sentMessages;
    }
    console.log('no sent message found for these two users');
  }

  async getReceivedMessages(
    sender_id: string,
    receiver_room_id: string,
  ): Promise<Message[]> {
    const senderID = new mongoose.Types.ObjectId(sender_id);
    const receivedID = new mongoose.Types.ObjectId(receiver_room_id);
    const receivedMessages = await this.messageModel.find({
      sender_id: receivedID,
      receiver_room_id: senderID,
    });
    await this.markMessageAsRead(receiver_room_id, sender_id);
    if (receivedMessages) {
      console.log(receivedMessages);
      return receivedMessages;
    }
    console.log('no received messages between the two users');
  }

  async getGroupMembers(my_id: string) {
    return await this.roomUserService.getAllGroupMembers(my_id);
  }

  async getAllTheGroups() {
    return await this.roomService.getAllGroups();
  }

  async getSingleUserRoom(user_id: string) {
    return await this.roomService.getSingleRoom(user_id);
  }

  async getOneUserRoom(user_id: string) {
    return await this.roomService.fetchOneRoom(user_id);
  }

  shuffleMessages(array: any[]) {
    if (array.length <= 1) return array;
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  }
}
