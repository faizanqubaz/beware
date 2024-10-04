import mongoose, { Schema, Document } from 'mongoose';

interface IIbex extends Document {

  ibexname: string,
  description: string,
  ibexrate:string, // Assuming rate is a number
  guideName: string,
  ibexsize: string,
  priceOld: string,
  newPrice: string,
  huntername: string,
  hunterlocation: string,
  latitude: string,
  longitude: string,
  huntdate: string,
  huntType:string,
  ibexphotos: string[], // Array of photo URLs
  guidephotos: string[], // Array of guide photo URLs
}

export { IIbex };
