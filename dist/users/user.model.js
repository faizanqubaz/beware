"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});
userSchema.statics.build = (attr) => {
    return new Admin(attr);
};
const Admin = mongoose_1.default.model('AdminPassu', userSchema);
exports.Admin = Admin;
