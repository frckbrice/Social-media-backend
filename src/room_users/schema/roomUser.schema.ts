import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type RoomUserDocument = HydratedDocument<RoomUser>;
@Schema({ timestamps: true, versionKey: false })
export class RoomUser extends Document {
  @Prop({ ref: 'User', required: true })
  user_id: string;

  @Prop({ ref: 'Room', required: true })
  group_id: string;

  @Prop({ enum: ['member', 'admin'], default: 'member' })
  role: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  // user_id: mongoose.Schema.Types.ObjectId;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' })
  // room_id: mongoose.Schema.Types.ObjectId;

  // @Prop({ type: String, enum: ['member', 'admin'], default: 'member' })
  // role: string;
}

// export const roomUserSchema = new mongoose.schema({
//   user_id: {required: true, type: String},
//   room_id: {required: true, type: String},
//   role: {
//     type: String,
//     enum: ['member', 'admin'],
//     default: 'member'
//   }

// })

export const RoomUserSchema = SchemaFactory.createForClass(RoomUser);

RoomUserSchema.set('toJSON', {
  transform: (ducument, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
