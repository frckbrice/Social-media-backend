import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/users.schema';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoomsModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
