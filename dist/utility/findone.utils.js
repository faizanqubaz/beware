"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserToDB = exports.findUserByEmail = exports.saveCustomer = exports.findCustomerBYEmail = void 0;
const customer_model_1 = require("../customers/customer.model");
const user_model_1 = require("../users/user.model");
const findCustomerBYEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customer_model_1.Customer.findOne({
        email: email,
    });
    return customer;
});
exports.findCustomerBYEmail = findCustomerBYEmail;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: email });
    return user;
});
exports.findUserByEmail = findUserByEmail;
const saveCustomer = (UserExists, inviteFrom, role) => __awaiter(void 0, void 0, void 0, function* () {
    const newCustomer = customer_model_1.Customer.build({
        name: UserExists[0].name,
        email: UserExists[0].email,
        created_at: UserExists[0].created_at,
        username: UserExists[0].nickname,
        picture: UserExists[0].picture,
        userId: UserExists[0].userId,
        inviteFrom: inviteFrom,
        role: role
    });
    return yield newCustomer.save();
});
exports.saveCustomer = saveCustomer;
const saveUserToDB = (UserExists, role) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserAdded = user_model_1.User.build({
        name: UserExists[0].name,
        email: UserExists[0].email,
        created_at: UserExists[0].created_at,
        username: UserExists[0].nickname,
        authUserId: UserExists[0].user_id,
        picture: UserExists[0].picture,
        role: role,
    });
    return yield newUserAdded.save();
});
exports.saveUserToDB = saveUserToDB;
