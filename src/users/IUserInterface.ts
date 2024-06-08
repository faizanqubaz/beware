import mongoose, { Model, Document } from 'mongoose';

interface IUser {
  name: String;
  email: String;
  created_at: String;
  username: String;
  picture: String;
}

interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {
  build(attr: IUser): IUserDocument;
}

interface IEmailArc {
  to: string;
}

interface IEmailRequestBody {
  email: string;
}

export { IUser, IUserDocument, IUserModel, IEmailArc, IEmailRequestBody };
