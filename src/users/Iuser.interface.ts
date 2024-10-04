import mongoose, { Model, Document } from 'mongoose';

interface IAdmin {
 email:string
 password:string
}

interface IAdminDocument extends IAdmin, Document {}

interface ICustomerModel extends Model<IAdminDocument> {
  build(attr: IAdmin): IAdminDocument;
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

export { IAdmin, IAdminDocument, ICustomerModel, IEmailArc, IEmailRequestBody };
