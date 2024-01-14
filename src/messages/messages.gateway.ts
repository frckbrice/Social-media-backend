import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket, Server } from 'socket.io';
import { Message } from './interface/messages.interface';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Room } from 'src/rooms/interface/room.interface';
// import express from 'express';
// import http from 'node:http';

// const server = http.createServer(express());
// const io = new Server(server);

// import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://waxchat-backend.onrender.com',
      '*',
    ],
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer() server: Server;

  private connectedUser: [
    { user_id: string; status: boolean; last_presence: number },
  ];
  private currentUser: string = '';
  private areConnected: string[] = [];

  handleConnection(socket: Socket) {
    console.log(`client connected: ${socket.id}`);
  }
  handleDisconnect(socket: Socket): void {
    console.log(`client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('disconnected')
  async handleDisconnection(
    @MessageBody() data: { room: Room; owner: Room },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('inside disconnect', data);
    if (data.owner?.original_dm_roomID) {
      this.server
        .to(data.room?.original_dm_roomID)
        .emit('disconnected', `🔴 ${data?.owner?.name} disconnected`);
    } else {
      this.server
        .to(data.room?.id)
        .emit('disconnected', `🔴 ${data?.owner?.name} disconnected`);
    }
    client.leave(data.room?.id);

    console.log(`The user  ${data.owner?.name} has disconnected`);
  }

  @SubscribeMessage('typing')
  async handleHeartbeat(@MessageBody() data: { room: string; owner?: string }) {
    const user = await this.messagesService.getOneUserRoom(data.owner);
    // console.log(data);

    this.server
      .to(data.room)
      .to(data.owner)
      .emit('typingResponse', `${user.name} is typing`);
  }

  @SubscribeMessage('connected')
  async handleJoinRoom(
    @MessageBody() data: { room: string; owner?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);

    if (this.currentUser !== data.room) {
      this.currentUser = data.room;
    }
    const user = await this.messagesService.getOneUserRoom(data.owner);
    this.server.to(data?.room).emit('notify', `🟢 ${user?.name} connected `);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: CreateMessageDto & any) {
    const message = await this.messagesService.createMessage(
      data,
      this.currentUser,
    );
    return this.server.to(data.receiver_room_id).emit('message', message);
    // const allGroups = await this.messagesService.getAllTheGroups();

    // if (allGroups.includes(data.receiver_room_id)) {
    // return this.server.to(data.receiver_room_id).emit('message', message);
    // }

    // this.server
    //   .to(data?.receiver_room_id)
    //   .to(data?.sender_id)
    //   .emit('message', message);
  }

  @SubscribeMessage('roomMessages')
  async getMessages(@MessageBody() data: { [id: string]: string }) {
    const allGroups = await this.messagesService.getAllTheGroups();
    if (allGroups.includes(data.receiver_room_id)) {
      const groupMessages = await this.messagesService.getGroupMessage(
        data.receiver_room_id,
        data.sender_id,
      );

      this.server
        .to(data?.sender_id)
        .to(data.receiver_room_id)
        .emit('message', groupMessages);
      return;
    } else {
      const roomMessages = await this.messagesService.getb2bMessages(
        data.sender_id,
        data.receiver_room_id,
      );
      console.log('b2b  messages ', roomMessages);
      this.server
        .to(data?.sender_id)
        .to(data.receiver_room_id)
        .emit('message', roomMessages);
    }
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @MessageBody()
    data: { messageId: string; updateValue: string; room: string },
    // @ConnectedSocket() client: Socket
  ): Promise<Message> {
    console.log(data);
    const updatedMessage = await this.messagesService.updateMessage(
      data.messageId,
      data.updateValue,
    );
    this.server.to(data.room).emit('updateMessage', updatedMessage);

    console.log(updatedMessage);
    return updatedMessage;
  }
}
