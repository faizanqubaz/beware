import mongoose, { Schema, Document } from "mongoose";
import {IProject} from './IProject.interface'

const ProjectSchema: Schema = new Schema({
  projectname: { type: String, required: true },
  description: { type: String, required: true },
  projectcost: { type: String, required: true },
  projectfor: { type: String, required: true },
  projecttype: { type: String, required: true, enum: ["pending", "completed", "future", "cancelled"] },
  summary: { type: String, required: true },
  completiondate: { type: Date, required: true },
  startdate: { type: Date, required: true },
  lastdate: { type: Date, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  huntername: { type: String },
  hunterlocation: { type: String },
  ibexsize: { type: String },
  priceOld: { type: String },
  ibexphotos: [
    {
      cloudinary_url: { type: String, required: true },
      cloudinary_id: { type: String, required: true },
    },
  ],
  projectphotos: [
    {
      cloudinary_url: { type: String, required: true },
      cloudinary_id: { type: String, required: true },
    },
  ],
});

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
