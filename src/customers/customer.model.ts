import mongoose from 'mongoose';
import {
  ICustomer,
  ICustomerDocument,
  ICustomerModel,
} from './ICustomerInterface';

const customerSchema = new mongoose.Schema({
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
  userId: {
    type: String,
  },
  role:{
    type:String
  }
});

customerSchema.statics.build = (attr: ICustomer) => {
  return new Customer(attr);
};

const Customer = mongoose.model<ICustomerDocument, ICustomerModel>(
  'Customers',
  customerSchema,
);

export { Customer };
