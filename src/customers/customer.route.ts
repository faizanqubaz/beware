import express, { Express, Request, Response } from 'express';
import {
  SendMail,
  saveTheUser,
  getAllCustomersBySender,
} from './customers.controller';
const router = express.Router();

router.post('/sendinvite', SendMail);
router.get('/confirmation-link', saveTheUser);
router.get('/customers', getAllCustomersBySender);

export { router as customerRoute };
