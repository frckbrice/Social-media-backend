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
// import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';

@WebSocketGateway()
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesService: MessagesService) {}
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { name: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('joined the room: ', data);
    client.join(data.room);
    //* store user to database
    this.server
      .to(data.room)
      .emit('message', `${data.name} joined the chat room`);

    // this.server.emit('message', `welcome to this chat room ${data.room}`);
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
  ): Promise<Message> {
    console.log('message sent', data);
    const message = await this.messagesService.createMessage(data);
    this.server
      .to(data.receiver_room_id)
      .to(data.sender_id)
      .emit('message', `${data.receiver_room_id}: ${data.content}`);

    // this.server.emit('message', `${client.id}: ${data.content}`);
    return message;
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.leave(data.room);
    this.server.to(data.room).emit('message', `${data.name} left the room`);
  }

  @SubscribeMessage('roomMessages')
  async getMessages(
    @MessageBody() data: { [id: string]: string },
  ): Promise<Message[]> {
    const roomMessages = await this.messagesService.getMessages(
      data.sender_room_id,
      data.receiver_room_id,
    );
    this.server.emit('roomMessages', roomMessages);
    return roomMessages;
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(
    @MessageBody() data: UpdateMessageDto & any,
    // @ConnectedSocket() client: Socket,
  ): Promise<Message> {
    const updatedMessage = await this.messagesService.updateMessage(
      data.messageId,
      data.value,
    );
    this.server.emit('updateMessage', updatedMessage);
    return updatedMessage;
  }
}
