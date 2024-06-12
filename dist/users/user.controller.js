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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_model_1 = require("./user.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, username } = req.body;
    if (!email || !name || !username) {
        return res.status(400).json({
            status: 400,
            message: 'email and name information should not be empty!',
        });
    }
    try {
        const newuser = user_model_1.User.build({
            name: name,
            email: email,
            username: username,
            role: 'user',
        });
        const userData = yield newuser.save();
        res.status(201).json({
            status: 200,
            message: 'user saved to the database',
            data: userData,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: `Error sending email: ${error}`,
        });
    }
});
exports.register = register;
