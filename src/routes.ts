import express, { Router } from 'express';
import { customerRoute } from './customers/customer.route';
import { userRoute } from './users/user.route';
import { paintsRoute } from './paints/paints.route';
const router: Router = express.Router();

router.use('/customer', customerRoute);
router.use('/user', userRoute);
router.use('/paint', paintsRoute);

export { router as mainRouter };
