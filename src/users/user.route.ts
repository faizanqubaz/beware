import express, { Express, Request, Response } from 'express';
import { getAllUserByEmail } from './user.controller';
const router = express.Router();

router.get('/userbyemail', getAllUserByEmail);

export { router as userRoute };
