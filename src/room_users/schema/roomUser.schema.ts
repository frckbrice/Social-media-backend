import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

Schema({ timestamps: true, versionKey: false });

export class RoomUser extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' })
  room_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, enum: ['member', 'admin'], default: 'member' })
  role: string;
}

export const RoomUserSchema = SchemaFactory.createForClass(RoomUser);

RoomUserSchema.set('toJSON', {
  transform: (ducument, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
