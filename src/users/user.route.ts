import express, { Express, Request, Response } from 'express';
import {
  SendMail,
  saveTheUser,
  getAllCustomersBySender,
} from './user.controller';
const router = express.Router();

router.post('/sendmail', SendMail);
router.get('/confirmation-link', saveTheUser);
router.get('/customers', getAllCustomersBySender);

export { router as userRoute };
