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
exports.updateUserRole = exports.updateUserById = exports.deleteUserById = exports.getAllUserByEmail = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
const dotenv_1 = __importDefault(require("dotenv"));
const findone_utils_1 = require("../utility/findone.utils");
const auth_utility_1 = require("../utility/auth.utility");
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
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid userId format',
            });
        }
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const auth0UserId = user.authUserId;
        // Delete user from Auth0
        const token = yield (0, auth_utility_1.getManagementToken)();
        yield (0, auth_utility_1.deleteAuth0User)(auth0UserId, token);
        // Delete user from MongoDB
        const deletedUser = yield user_model_1.User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully', deletedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteUserById = deleteUserById;
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid userId format',
            });
        }
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const auth0UserId = user.auth0UserId;
        // Update user in Auth0
        const token = yield (0, auth_utility_1.getManagementToken)();
        yield (0, auth_utility_1.updateAuth0User)(auth0UserId, updateData, token);
        // Update user in MongoDB
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, {
            new: true,
        });
        res.json({ message: 'User updated successfully', updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateUserById = updateUserById;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid userId format',
            });
        }
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const auth0UserId = user.auth0UserId;
        // Update user's role in Auth0
        const token = yield (0, auth_utility_1.getManagementToken)();
        yield (0, auth_utility_1.updateAuth0UserRole)(auth0UserId, role, token);
        // Update user's role in MongoDB
        user.role = role;
        const updatedUser = yield user.save();
        res.json({ message: 'User role updated successfully', updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateUserRole = updateUserRole;
