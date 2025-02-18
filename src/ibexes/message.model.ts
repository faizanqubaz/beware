import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  message: string;

}

const IbexMessageSchema: Schema = new Schema({
    message: { type: String, required: true },
   
});

export const IbexMessage = mongoose.model<IMessage>("IbexMessage", IbexMessageSchema);
