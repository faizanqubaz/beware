import mongoose from 'mongoose';
import { IUser, IUserDocument, IUserModel } from './IUserInterface';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  created_at: {
    type: String,
  },
  picture: {
    type: String,
  },
  inviteFrom: {
    type: String,
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<IUserDocument, IUserModel>('Users', userSchema);

export { User };
