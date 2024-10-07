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
exports.AuthenticateAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
// import { findUserByEmail } from '../utility/findone.utils';
// import {
//   addRoleToUser,
//   auth0CustomLogin,
//   auth0Signup,
//   deleteAuth0User,
//   getAuth0UserDetails,
//   getManagementToken,
//   updateAuth0User,
//   updateAuth0UserRole,
//   assignRoleToUser,
// } from '../utility/auth.utility';
// import dotenv from 'dotenv';
// // Load environment variables
// dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
// const getAllUserByEmail = async (req: Request, res: Response) => {
//   const { email: useremail } = req.query;
//   if (!useremail) {
//     return res.status(400).json({
//       status: 400,
//       message: 'userEmail query parameter is required!',
//     });
//   }
//   try {
//     const user = await findUserByEmail(useremail as string);
//     if (!user) {
//       return res.status(404).json({
//         status: 404,
//         message: 'No User found for this email',
//       });
//     }
//     return res.status(200).json({
//       status: 200,
//       message: 'User found',
//       data: user, // Include user data in the response if needed
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: 500,
//       message: 'An error occurred while fetching the user',
//     });
//   }
// };
// const deleteUserById = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Invalid userId format',
//       });
//     }
//     const user: any = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const auth0UserId = user.authUserId;
//     // Delete user from Auth0
//     const token = await getManagementToken();
//     await deleteAuth0User(auth0UserId, token);
//     // Delete user from MongoDB
//     const deletedUser = await User.findByIdAndDelete(userId);
//     res.json({ message: 'User deleted successfully', deletedUser });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
// const updateUserById = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const updateData = req.body;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Invalid userId format',
//       });
//     }
//     const user: any = await User.findById(userId);
//     console.log('user', user);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const auth0UserId = user.authUserId;
//     // Update user in Auth0
//     const token = await getManagementToken();
//     const updatedData = {
//       name: user.username,
//       // This will be ignored for non-Auth0 connections
//     };
//     updateAuth0User(auth0UserId, updatedData, token);
//     // Update user in MongoDB
//     const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
//       new: true,
//     });
//     res.json({ message: 'User updated successfully', updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
// const updateUserRole = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const { role } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Invalid userId format',
//       });
//     }
//     const user: any = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const auth0UserId = user.authUserId;
//     // Update user's role in Auth0
//     const token = await getManagementToken();
//     updateAuth0UserRole(auth0UserId, role, token);
//     // Update user's role in MongoDB
//     user.role = role;
//     const updatedUser = await user.save();
//     res.json({ message: 'User role updated successfully', updatedUser });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
// const getAllUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const users = await User.find();
//     res.status(200).json({
//       message: 'retrive all users from DB',
//       data: users,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error });
//   }
// };
// const customSignup = async (req: Request, res: Response) => {
//   try {
//     const { email, password, username } = req.body;
//     console.log('email', email);
//     console.log('password', password);
//     const user = await auth0Signup(email, password, username);
//     console.log('user', user);
//     const userId = user._id;
//     const managementToken = await getManagementToken();
//     const signupRole = 'enduser';
//     await assignRoleToUser(managementToken, userId, signupRole);
//     res.send('Signup successful');
//   } catch (error: any) {
//     res.status(400).send(`Signup error: ${error.message}`);
//   }
// };
// const customLogin = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const userInfo = await auth0CustomLogin(email, password);
//     const token = jwt.sign(userInfo, 'test');
//     res.json({ token });
//   } catch (error: any) {
//     res.status(400).send(`Login error: ${error.message}`);
//   }
// };
const AuthenticateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if the email exists in the database
        const admin = yield user_model_1.Admin.findOne({ email });
        console.log('admin', admin);
        if (!admin) {
            return res.status(404).json({ message: 'email not found' });
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // If email and password are correct, generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, 'mysecretpassword', {
            expiresIn: '1h', // Adjust token expiration as needed
        });
        // Return success with user data (without password) and token
        return res.status(200).json({
            message: 'Login successful',
            data: {
                email: admin.email,
                name: admin.password,
            },
            token, // Send token if you plan to use JWT
        });
    }
    catch (error) {
        console.error('Error authenticating admin:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.AuthenticateAdmin = AuthenticateAdmin;
