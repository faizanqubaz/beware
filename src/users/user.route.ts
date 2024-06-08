import express, { Express, Request, Response } from 'express';
import { SendMail, saveTheUser } from './user.controller';
const router = express.Router();

router.post('/sendmail', SendMail);
router.get('/confirmation-link', saveTheUser);

export { router as userRoute };
