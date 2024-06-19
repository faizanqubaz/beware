import express, { Express, Request, Response } from 'express';
import {
  deleteUserById,
  getAllUserByEmail,
  updateUserById,
  updateUserRole,
  getAllUsers,
} from './user.controller';
const router = express.Router();

router.get('/userbyemail', getAllUserByEmail);
router.delete('/:userId', deleteUserById);
router.put('/:userId', updateUserById);
router.put('/:userId/roles', updateUserRole);
router.get('/users', getAllUsers);

export { router as userRoute };
