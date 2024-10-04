import express, { Router } from 'express';
// import { customerRoute } from './customers/customer.route';
import { userRoute } from './users/user.route';
import { IbexRoute } from './ibexes/ibex.route';
const router: Router = express.Router();

router.use('/ibex', IbexRoute);
// router.use('/login',adminRoute)

export { router as mainRouter };
