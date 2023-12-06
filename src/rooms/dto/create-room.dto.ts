import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  save(): import("src/rooms/schema/room.schema").Room | PromiseLike<import("src/rooms/schema/room.schema").Room> {
    throw new Error('Method not implemented.');
  }
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsNotEmpty()
  isGroup: boolean;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
