import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Room>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  isGroup: boolean;

  @Prop()
  user_id: string;

  @Prop()
  my_id: string;

  @Prop()
  original_dm_roomID: string;
}
export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
