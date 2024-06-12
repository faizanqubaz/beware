import mongoose from 'mongoose';
import { IUser, IUserDocument, ICustomerModel } from './Iuser.interface';

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
  role: {
    type: String,
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

const User = mongoose.model<IUserDocument, ICustomerModel>('Users', userSchema);

export { User };
