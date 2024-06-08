import mongoose, { Model, Document } from 'mongoose';

interface IUser {
  name: String;
  username: String;
  password:String;
}

interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {
  build(attr: IUser): IUserDocument;
}

export { IUser, IUserDocument, IUserModel };
