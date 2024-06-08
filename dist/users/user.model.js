"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String
    },
    password: {
        type: String,
    },
});
userSchema.statics.build = (attr) => {
    return new User(attr);
};
const User = mongoose_1.default.model('Users', userSchema);
exports.User = User;
