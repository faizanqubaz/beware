import mongoose, { Model, Document } from 'mongoose';

interface IUser {
  name: String;
  email: String;
  username?: String;
  created_at?: String;
  authUserId?: String;
  picture?: String;
  role: String;
}

interface IUserDocument extends IUser, Document {}

interface ICustomerModel extends Model<IUserDocument> {
  build(attr: IUser): IUserDocument;
}

interface IEmailArc {
  to: string;
  sender: {
    name: string;
    email: string;
  };
  role: string;
}

interface IEmailRequestBody {
  email: string;
  sender: {
    name: string;
    email: string;
  };
}

export { IUser, IUserDocument, ICustomerModel, IEmailArc, IEmailRequestBody };
