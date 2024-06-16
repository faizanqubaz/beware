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
exports.deleteUserById = exports.getAllUserByEmail = void 0;
const user_model_1 = require("./user.model");
const dotenv_1 = __importDefault(require("dotenv"));
const findone_utils_1 = require("../utility/findone.utils");
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
        const user = yield (0, findone_utils_1.findUserByEmail)(useremail);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'No User found for this email',
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'User found',
            data: user, // Include user data in the response if needed
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while fetching the user',
        });
    }
});
exports.getAllUserByEmail = getAllUserByEmail;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const deletedUser = yield user_model_1.User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', deletedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteUserById = deleteUserById;
