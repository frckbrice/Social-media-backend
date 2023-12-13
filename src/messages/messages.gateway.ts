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
  private can_proceed: boolean = false;

  handleConnection(socket: Socket) {
    console.log(`client connected: ${socket.id}`);
  }
  handleDisconnect(socket: Socket): void {
    console.log(`client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('disconnected')
  async handleDisconnection(
    @MessageBody() room_id: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (room_id) {
      this.server.to(room_id.toString()).emit(`user ${room_id} disconnected`);
      client.leave(room_id.toString());
    }

    this.can_proceed = true;
    console.log(`This user has disconnected ${room_id}`);
  }

  @SubscribeMessage('typing')
  async handleHeartbeat(
    @MessageBody() data: { receiver: Room; currentUser: Room },
  ) {
    // const userRoom = await this.messagesService.getSingleUserRoom(user_id);
    // console.log(data);
    this.can_proceed = false;
    if (data.receiver)
      this.server
        .to(data.receiver.original_dm_roomID)
        // .to(data.currentUser.id)
        .emit('typingResponse', `${data.currentUser.name} is typing`);
  }

  @SubscribeMessage('connected')
  async handleJoinRoom(
    @MessageBody() data: { room: string; owner?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.can_proceed = false;
    if (this.currentUser !== data.owner) {
      this.handleDisconnection(this.currentUser, client);
      this.currentUser = data.owner;
    }
    const user = await this.messagesService.getOneUserRoom(data.owner);
    this.server.to(data?.room).emit('notify', `${user.name} 🟢 online `);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto & any,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messagesService.createMessage(
      data,
      this.currentUser,
    );

    const [groupMembers, allGroups] = await Promise.all([
      (await this.messagesService.getGroupMembers(data.receiver_room_id))[0],
      await this.messagesService.getAllTheGroups(),
    ]);
    console.log('all group members: ', groupMembers);
    const tagets = groupMembers?.filter(
      (groupMemberId) => groupMemberId !== data.sender_id,
    );
    if (allGroups.includes(data.receiver_room_id) && groupMembers.length) {
      // for (const userId of tagets) {
      //   console.log('message to distribute: ', message);
      //   this.server.to(data.sender_id).to(userId).emit('message', message);
      //   this.server.to(userId).emit('message', message);
      // }
      this.server.to(data.receiver_room_id).emit('message', message);
      return;
    }

    this.server
      .to(data?.receiver_room_id)
      .to(data?.sender_id)
      .emit('message', message);
  }

  @SubscribeMessage('roomMessages')
  async getMessages(@MessageBody() data: { [id: string]: string }) {
    const allGroups = await this.messagesService.getAllTheGroups();
    if (allGroups.includes(data.receiver_room_id)) {
      const groupMessages = await this.messagesService.getGroupMessage(
        data.receiver_room_id,
        data.sender_id,
      );
      console.log(
        // 'group messages: ' + groupMessages,
        'typeof groupMessages',
        Array.isArray(groupMessages),
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
    @MessageBody() data: { [id: string]: string },
    updateMessageDto: UpdateMessageDto,
    // @ConnectedSocket() client: Socket
  ): Promise<Message> {
    const updatedMessage = await this.messagesService.updateMessage(
      data.sender_id,
      data.receiver_room_id,
      updateMessageDto,
    );
    this.server.emit('updateMessage', updatedMessage);
    return updatedMessage;
  }
}
