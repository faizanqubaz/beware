import express, { Express, Request, Response } from 'express';
import { deleteUserById, getAllUserByEmail } from './user.controller';
const router = express.Router();

router.get('/userbyemail', getAllUserByEmail);
router.delete('/:userId', deleteUserById);

export { router as userRoute };
