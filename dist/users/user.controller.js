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
exports.getAllUserByEmail = void 0;
const user_model_1 = require("./user.model");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email: useremail } = req.query;
    if (!useremail) {
        return res.status(400).json({
            status: 400,
            message: 'userEmail query parameter is required!',
        });
    }
    try {
        const users = yield user_model_1.User.find({ email: useremail });
        if (users.length === 0) {
            return res.status(200).json({
                status: 200,
                message: 'No User found for this email',
            });
        }
        res.status(200).json({
            status: 200,
            data: users,
        });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 500,
            message: 'Error fetching users',
        });
    }
});
exports.getAllUserByEmail = getAllUserByEmail;
