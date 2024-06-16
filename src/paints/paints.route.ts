import express, { Express, Request, Response } from 'express';
import {
  savePaintsofCustomer,
  getCustomerWithPaints,
} from './paints.controller';
const router = express.Router();

router.post('/:customerId/save', savePaintsofCustomer);
router.get('/:customerId/paints', getCustomerWithPaints);

export { router as paintsRoute };
