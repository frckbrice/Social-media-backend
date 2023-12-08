import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessageSchema } from './schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    RoomsModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
