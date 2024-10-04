"use strict";
// import { ICustomerDocument } from '../customers/ICustomerInterface';
// import { Customer } from '../customers/customer.model';
// import { User } from '../users/user.model';
// const findCustomerBYEmail = async (email: string) => {
//   const customer = await Customer.findOne({
//     email: email,
//   });
//   return customer;
// };
// const findUserByEmail = async (email: string) => {
//   const user = await User.findOne({ email: email });
//   return user;
// };
// const saveCustomer = async (user: any, inviteFrom: string, role: string) => {
//   const newCustomer: ICustomerDocument = Customer.build({
//     name: user.name,
//     email: user.email,
//     created_at: user.created_at,
//     username: user.nickname,
//     picture: user.picture,
//     userId: user.userId,
//     inviteFrom: inviteFrom,
//     role: role,
//   });
//   return await newCustomer.save();
// };
// const saveUserToDB = async (user: any, role: string) => {
//   const newUserAdded = User.build({
//     name: user.name,
//     email: user.email,
//     created_at: user.created_at,
//     username: user.nickname,
//     authUserId: user.user_id,
//     picture: user.picture,
//     role: role,
//   });
//   return await newUserAdded.save();
// };
// export { findCustomerBYEmail, saveCustomer, findUserByEmail, saveUserToDB };
