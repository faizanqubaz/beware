import express, { Router } from 'express';
import { customerRoute } from './customers/customer.route';
import { userRoute } from './users/user.route';
const router: Router = express.Router();

router.use('/customer', customerRoute);
router.use('/user', userRoute);

export { router as mainRouter };
