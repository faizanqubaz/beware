import express, { Router } from 'express';
import { customerRoute } from './customers/customer.route';
const router: Router = express.Router();

router.use('/customer', customerRoute);

export { router as mainRouter };
