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

// import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000', '*'] } })
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
    // const user = await this.messagesService.getSingleUserGroup(user_id);
    if (room_id) {
      this.server
        .to(room_id.toString())
        .emit(`user ${room_id} has left the group`);
      client.leave(room_id.toString());
    }

    this.can_proceed = true;
    console.log(`This user has disconnected ${room_id}`);
  }

  @SubscribeMessage('typing')
  async handleHeartbeat(
    @MessageBody() data: { receiver: string; currentUser: Room },
  ) {
    // const userRoom = await this.messagesService.getSingleUserRoom(user_id);
    this.can_proceed = false;
    if (data.receiver)
      this.server
        .to(data.receiver)
        .to(data.currentUser.id)
        .emit('typingResponse', `${data.currentUser.name} is typing`);
  }

  @SubscribeMessage('connected')
  handleJoinRoom(
    @MessageBody() data: { room: string; owner?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);
    this.can_proceed = false;
    if (this.currentUser !== data.owner) {
      this.handleDisconnection(this.currentUser, client);
      this.currentUser = data.owner;
    }
    this.server.to(data?.room).emit('notify', data.owner);
  }

  @SubscribeMessage('groupMessage')
  async handleGroupMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<Message[]> {
    const groupMessages = await this.messagesService.getGroupMessage(
      data.receiver_room_id,
    );
    console.log('joined the group message chat: ', data);
    client.join(data.receiver_room_id);
    this.server.emit('updateMessage', groupMessages);
    return groupMessages;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('message from frontend', data);
    if (this.currentUser) {
    }
    const message = await this.messagesService.createMessage(
      data,
      this.can_proceed,
    );

    const allGroups = await this.messagesService.getAllTheGroups();
    if (allGroups.includes(data.receiver_room_id)) {
      return client.broadcast
        .to(data.receiver_room_id)
        .emit('message', message);
    }

    this.server
      .to(data?.receiver_room_id)
      .to(data?.sender_id)
      .emit('message', message);

    // this.server.emit('message', `${client.id}: ${data.content}`);
  }

  // @SubscribeMessage('leaveRoom')
  // handleLeaveRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
  //   client.leave(data.room);
  //   this.server.to(data.room).emit('message', `${data.name} left the room`);
  // }

  @SubscribeMessage('roomMessages')
  async getMessages(@MessageBody() data: { [id: string]: string }) {
    const roomMessages = await this.messagesService.getMessages(
      data.sender_id,
      data.receiver_room_id,
    );
    this.can_proceed = false;
    console.log('messages to return', roomMessages);
    this.server.emit('message', roomMessages);
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
