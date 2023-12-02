import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

Schema({
  timestamps: true,
});

export class Message extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  sender_id: mongoose.Schema.Types.ObjectId;

  @Prop()
  reaction: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
  receiver_room_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  sender_name: string;

  @Prop()
  phone: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
//*compound index to significantly retrieve message between sender and reciver
MessageSchema.index({ sender_id: 1, receiver_room_id: 1 });

MessageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

// this approche also work but it may increase document size and require more complex handling of embedded documents.
// not also good for scalability

//  export class Message {
//    @Prop({ type: UserSchema, ref: 'User' })
//    sender_id: UserSchema;

//    @Prop({ type: RoomSchema, ref: 'Room' })
//    receiver_room_id: RoomSchema;
//  }

//  export const MessageSchema = SchemaFactory.createForClass(Message);
//  MessageSchema.index({ sender_id: 1, receiver_room_id: 1 });
