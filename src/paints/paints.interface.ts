import mongoose, { Schema, Document } from 'mongoose';

interface IPaint extends Document {
  customerId: mongoose.Types.ObjectId;
  colorName: string;
  quantity: number;
  price: number;
  colorCode: string;
  yearRange: string;
  brand: string;
  size: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export { IPaint };
