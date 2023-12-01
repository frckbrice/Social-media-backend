import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>

@Schema({
  timestamps: true,
  versionKey: false
})

export class User {
  @Prop()
  id: string

  @Prop()
  name: string

  @Prop()
  email: string

  @Prop()
  phone: string

  @Prop()
  profile: string

  @Prop()
  wsId: string

}
export const UserSchema = SchemaFactory.createForClass(User);
