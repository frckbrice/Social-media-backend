import { Injectable } from '@nestjs/common';
import { CreateUnreadMessageDto } from './dto/create-unread_message.dto';
import { UpdateUnreadMessageDto } from './dto/update-unread_message.dto';

@Injectable()
export class UnreadMessagesService {
  create(createUnreadMessageDto: CreateUnreadMessageDto) {
    return 'This action adds a new unreadMessage';
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
