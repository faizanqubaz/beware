"use strict";
// import mongoose, { Schema, Document } from 'mongoose';
// import {
//   ICustomer,
//   ICustomerDocument,
//   ICustomerModel,
// } from './ICustomerInterface';
// const customerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//   },
//   username: {
//     type: String,
//   },
//   created_at: {
//     type: String,
//   },
//   picture: {
//     type: String,
//   },
//   inviteFrom: {
//     type: String,
//   },
//   userId: {
//     type: String,
//   },
//   role: {
//     type: String,
//   },
//   paints: [{ type: Schema.Types.ObjectId, ref: 'Paints', default: [] }],
// });
// customerSchema.statics.build = (attr: ICustomer) => {
//   return new Customer(attr);
// };
// const Customer = mongoose.model<ICustomerDocument, ICustomerModel>(
//   'Customers',
//   customerSchema,
// );
// export { Customer };
