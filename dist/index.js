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
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routes_1 = require("./routes");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// import {
//   getAuth0Users,
//   getManagementToken,
//   getUserRolesCronJob,
// } from './utility/auth.utility';
// import { findUserByEmail, saveUserToDB } from './utility/findone.utils';
// import { IUser } from './users/Iuser.interface';
// import { User } from './users/user.model';
// Load environment variables
if (process.env.NODE_ENV === 'production') {
    dotenv_1.default.config({ path: '.env.production' });
}
else {
    dotenv_1.default.config({ path: '.env.development' });
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, body_parser_1.json)());
app.use('/uploads', express_1.default.static('uploads'));
const allowedOrigins = ['https://passu-conservency-csbodzukv-faizans-projects-7efc1ab6.vercel.app', ''];
// Configure CORS
const corsOptions = {
    origin: ['https://passu-conservency.vercel.app', 'http://localhost:3000'], // Replace with your actual Vercel URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)(corsOptions));
app.use('/api/v2', routes_1.mainRouter);
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://faizanquba1:wk63Jpi7c16ISRyE@search-apserverdb.mj8x8op.mongodb.net/?retryWrites=true&w=majority&appName=search-apserverDB';
// Dynamic BASE_URL based on NODE_ENV
const BASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL || 'https://mycarcolor-8348d7d97064.herokuapp.com/'
    : process.env.BASE_URL || 'http://localhost:3000';
app.get('/test', (req, res) => {
    res.send('<img src="/uploads/1727503182526-355697014-team3.jpg" alt="Sample Image" />');
});
// CONNECT TO THE MONGODB
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI, {
            ssl: true,
        });
        console.log('Connected to DB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Base URL: ${BASE_URL}`);
        });
    }
    catch (err) {
        console.error('Failed to connect to DB', err);
    }
});
start();
// const checkAndSaveUsers = async () => {
//   try {
//     const token = await getManagementToken();
//     const users = await getAuth0Users(token);
//     for (const user of users) {
//       const roles = await getUserRolesCronJob(token, user.user_id);
//       const existingUser = await findUserByAuth0Email(user.email);
//       if (!existingUser) {
//         const role = roles.length > 0 ? roles[0].name : 'enduser';
//         await saveUserUsingCronJob({
//           email: user.email,
//           name: user.name,
//           username: user.username,
//           created_at: user.created_at,
//           authUserId: user.user_id,
//           picture: user.picture,
//           role, // Store as a string
//         });
//         console.log(`User ${user.email} saved to MongoDB`);
//       } else {
//         console.log(`User ${user.email} already exists in MongoDB`);
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching or saving users:', error);
//   }
// };
// const findUserByAuth0Email = async (email: string): Promise<IUser | null> => {
//   return await User.findOne({ email });
// };
// const saveUserUsingCronJob = async (
//   user: Partial<IUser>,
// ): Promise<IUser | null> => {
//   try {
//     const newUser = new User(user);
//     return await newUser.save();
//   } catch (error: any) {
//     if (error.code === 11000) {
//       // Duplicate key error
//       console.log(`Duplicate email error: ${user.email} already exists.`);
//       return null;
//     } else {
//       throw error;
//     }
//   }
// };
// // Schedule the cron job to run every 10 seconds
// cron.schedule('*/10 * * * * *', checkAndSaveUsers);
