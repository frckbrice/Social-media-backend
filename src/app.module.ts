import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { UnreadMessagesModule } from './unread_messages/unread_messages.module';
import { RoomUsersModule } from './room_users/room_users.module';

@Module({
  imports: [
    MessagesModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    RoomsModule,
    UnreadMessagesModule,
    RoomUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
