import mongoose, { Schema, Document } from "mongoose";

interface IbexPhoto {
  cloudinary_url: string;
  cloudinary_id: string;
}

export interface IIbex extends Document {
  ibexname: string;
  ibexphotos: IbexPhoto[];
  guidephotos: IbexPhoto[];
}

const IbexSchema: Schema = new Schema({
    description: { type: String, required: true },
    ibexrate: { type: Number, required: true }, // Assuming rate is a number
    guideName: { type: String, required: true },
    ibexsize: { type: String, required: true },
    priceOld: { type: String, required: true },
    newPrice: { type: String, required: true },
    huntername: { type: String, required: true },
    hunterlocation: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    huntdate: { type: Date, required: true },
    huntType:{type:String,required:true},
  ibexname: { type: String, required: true },
  ibexphotos: [
    {
      cloudinary_url: { type: String, required: true },
      cloudinary_id: { type: String, required: true },
    },
  ],
  guidephotos: [
    {
      cloudinary_url: { type: String, required: true },
      cloudinary_id: { type: String, required: true },
    },
  ],
});

export const Ibex = mongoose.model<IIbex>("Ibex", IbexSchema);
