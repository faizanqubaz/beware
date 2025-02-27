import express from 'express';
import { json } from 'body-parser';
import { mainRouter } from './routes';
import path from 'path'
import mongoose from 'mongoose';
import cron from 'node-cron';
import cors from 'cors';

import dotenv from 'dotenv';
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
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const app = express();

app.use(express.json({ limit: "500mb" })); // Increase limit for JSON
app.use(express.urlencoded({ limit: "500mb", extended: true }));
// app.use('/uploads', express.static('uploads'));


const allowedOrigins = ['https://beware-seven.vercel.app/', ''];


// Configure CORS
const corsOptions = {
  origin: ['https://beware-seven.vercel.app','http://localhost:3000','https://beware-frontend-d7uq.vercel.app'], // Replace with your actual Vercel URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204
};



app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// If using cookies or JWT tokens, add this middleware:
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use('/api/v2', mainRouter);

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://faizanquba1:wk63Jpi7c16ISRyE@search-apserverdb.mj8x8op.mongodb.net/?retryWrites=true&w=majority&appName=search-apserverDB';

// Dynamic BASE_URL based on NODE_ENV
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL || 'https://beware-seven.vercel.app/'
    : process.env.BASE_URL || 'http://localhost:3000';

    app.get('/test', (req, res) => {
      res.send('<img src="/uploads/1727503182526-355697014-team3.jpg" alt="Sample Image" />');
    });
// CONNECT TO THE MONGODB
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      ssl: true,
    });
    console.log('Connected to DB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Base URL: ${BASE_URL}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
  }
};

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
