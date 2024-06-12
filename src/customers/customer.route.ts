import express, { Express, Request, Response } from 'express';
import {
  SendInvite,
  saveTheUser,
  getAllCustomersBySender,
} from './customers.controller';
const router = express.Router();

router.post('/sendinvite', SendInvite);
router.get('/confirmation-link', saveTheUser);
router.get('/customers', getAllCustomersBySender);

export { router as customerRoute };
