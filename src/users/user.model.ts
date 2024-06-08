import mongoose from 'mongoose';
import { IUser, IUserDocument, IUserModel } from './IUserInterface';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<IUserDocument, IUserModel>('Users', userSchema);

export { User };
