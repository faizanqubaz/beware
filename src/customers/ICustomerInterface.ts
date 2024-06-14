import mongoose, { Model, Document } from 'mongoose';

interface ICustomer {
  name: String;
  email: String;
  created_at: String;
  username: String;
  picture: String;
  inviteFrom: String;
  userId: String;
  role:String;
}

interface ICustomerDocument extends ICustomer, Document {}

interface ICustomerModel extends Model<ICustomerDocument> {
  build(attr: ICustomer): ICustomerDocument;
}

interface IEmailArc {
  to: string;
  sender: {
    name: string;
    email: string;
  },
  role:string;
}

interface IEmailRequestBody {
  useremail: string;
  sender: {
    name: string;
    email: string;
  },
  role:string;
}

export {
  ICustomer,
  ICustomerDocument,
  ICustomerModel,
  IEmailArc,
  IEmailRequestBody,
};
