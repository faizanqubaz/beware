import mongoose from 'mongoose';
import { IAdmin, IAdminDocument, ICustomerModel } from './Iuser.interface';

const userSchema = new mongoose.Schema({

  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

userSchema.statics.build = (attr: IAdmin) => {
  return new Admin(attr);
};

const Admin = mongoose.model<IAdminDocument, ICustomerModel>('Admin', userSchema);

export { Admin };
