import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  // @Prop()
  // id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  image: string;

  @Prop()
  wsId: string;

  @Prop()
  about: string;

<<<<<<< HEAD
  @Prop()
  picture: string;
=======
>>>>>>> b3264e2bdabcba197672f1c0ace28bbbfc1328f8
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    //we return a string  ID to the front-end
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});
