import mongoose, { Schema } from 'mongoose';
import { IPaint } from './paints.interface';

const PaintSchema: Schema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    colorName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    colorCode: { type: String, required: true },
    yearRange: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: String, required: true },
  },
  { timestamps: true },
);

const Paint = mongoose.model<IPaint>('Paints', PaintSchema);

export { Paint, IPaint };
