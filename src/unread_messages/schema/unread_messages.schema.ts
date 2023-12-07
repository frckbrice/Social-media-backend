import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type unreadMessageDocument = HydratedDocument<UnreadMessage>

@Schema({ timestamps: true, versionKey: false })
export class UnreadMessage extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  })
  receiver_room_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  sender_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, default: 0 })
  unread_count: number;

  @Prop({ required: true, default: '' })
  last_message: string;
}

export const UnreadMessageSchema = SchemaFactory.createForClass(UnreadMessage);

UnreadMessageSchema.index({ sender_id: 1, receiver_room_id: 1 });

UnreadMessageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    //we return a string  ID to the front-end
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});
