import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Room {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  status: boolean;

  @Prop()
  user_id: string;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
