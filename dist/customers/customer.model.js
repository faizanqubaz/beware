"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    created_at: {
        type: String,
    },
    picture: {
        type: String,
    },
    inviteFrom: {
        type: String,
    },
    userId: {
        type: String,
    },
});
customerSchema.statics.build = (attr) => {
    return new Customer(attr);
};
const Customer = mongoose_1.default.model('Customers', customerSchema);
exports.Customer = Customer;
