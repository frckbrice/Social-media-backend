import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  // Param,
  Delete,
} from '@nestjs/common';
import { UnreadMessagesService } from './unread_messages.service';
import { CreateUnreadMessageDto } from './dto/create-unread_message.dto';
import { UpdateUnreadMessageDto } from './dto/update-unread_message.dto';

@Controller('unread-messages')
export class UnreadMessagesController {
  constructor(private readonly unreadMessagesService: UnreadMessagesService) {}

  @Post()
  create(@Body() createUnreadMessageDto: CreateUnreadMessageDto) {
    return this.unreadMessagesService.createUnreadMessage(
      createUnreadMessageDto,
    );
  }

  @Get()
  findAll() {
    return this.unreadMessagesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.unreadMessagesService.findOneUnreadMessage(+id);
  // }
  @Get(':id')
  findOne(@Body() data: any) {
    return this.unreadMessagesService.findOneUnreadMessage(data);
  }

  @Patch()
  update(
    @Body() sender_id: string,
    receiver_room_id: string,
    updateUnreadMessageDto: UpdateUnreadMessageDto,
  ) {
    return this.unreadMessagesService.update(
      sender_id,
      receiver_room_id,
      updateUnreadMessageDto,
    );
  }

  @Delete()
  remove(@Body() sender_id: string, receiver_room_id: string) {
    return this.unreadMessagesService.remove(sender_id, receiver_room_id);
  }
}
