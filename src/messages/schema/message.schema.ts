import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { Date } from 'mongoose';

Schema({
  timestamps: true,
});

export class Message {
  @Prop()
  content: string;

  @Prop({ type: Date, default: Date.now() })
  sent_at: Date;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'users' })
  sender_id: string;

  @Prop()
  reaction: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'rooms' })
  receiver_room_id: string;

  @Prop()
  sender_name: string;

  @Prop()
  phone: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});
