import express, { Express, Request, Response } from 'express';
import {
  SendInvite,
  saveTheUser,
  getAllCustomersBySender,
  getAuthorizationCode,
} from './customers.controller';
const router = express.Router();

router.post('/sendinvite', SendInvite);
router.get('/confirmation-link', saveTheUser);
router.get('/customers', getAllCustomersBySender);
router.get('/callback', getAuthorizationCode);

export { router as customerRoute };
