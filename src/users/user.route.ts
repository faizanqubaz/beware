import express, { Express, Request, Response } from 'express';
import {
  // deleteUserById,
  // getAllUserByEmail,
  // updateUserById,
  // updateUserRole,
  // getAllUsers,
  // customSignup,
  // customLogin,
  AuthenticateAdmin
} from './user.controller';
const router = express.Router();

// router.get('/userbyemail', getAllUserByEmail);
// router.delete('/:userId', deleteUserById);
// router.put('/:userId', updateUserById);
// router.put('/:userId/roles', updateUserRole);
// router.get('/users', getAllUsers);
// router.post('/signup', customSignup);
// router.post('/login', customLogin);
router.post('/', AuthenticateAdmin);

export { router as userRoute };
