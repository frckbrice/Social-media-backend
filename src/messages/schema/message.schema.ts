// import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
// import mongoose, { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

// export type MessageDocument = HydratedDocument<Message>;

// Schema({
//   timestamps: true,
// });

// export class Message {
//   @Prop({ required: true })
//   content: string;

//   // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
//   @Prop()
//   // sender_id: mongoose.Schema.Types.ObjectId;
//   sender_id: string;

//   @Prop()
//   reaction: string;

//   // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true })
//   @Prop()
//   // receiver_room_id: mongoose.Schema.Types.ObjectId;
//   receiver_room_id: string;

//   @Prop({ required: true })
//   sender_name: string;

//   @Prop()
//   sender_phone: string;

//   @Prop()
//   is_read: boolean;
// }

// export const MessageSchema = SchemaFactory.createForClass(Message);
// //*compound index to significantly retrieve message between sender and reciver

export const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender_id: { type: String, required: true },
  receiver_room_id: { type: String, required: true },
  sender_name: String,
  sender_phone: String,
  is_read: { type: Boolean, required: true },
  reaction: String,
  timestamp: { type: Date, default: Date.now() },
});
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
