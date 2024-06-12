import express, { Express, Request, Response } from 'express';
import { register } from './user.controller';
const router = express.Router();

router.post('/signup', register);

export { router as userRoute };
