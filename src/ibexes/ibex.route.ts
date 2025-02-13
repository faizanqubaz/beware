import express, { Express, Request, Response } from 'express';
import {
  saveIbex,
  getallcloudimages,
  deleteallcloud,
  saveTopOfferIbex,
  saveNewHuntIbex,
  sendMail,
  getAllIbex

} from './ibexs.controller';
import {upload} from '../utility/cloudnary.utils'

const router = express.Router();

// POST route for saving Ibex data with image upload
router.post('/popular',upload.fields([{ name: "ibexphotos", maxCount: 5 }, { name: "guidephotos", maxCount: 5 }]), saveIbex);
router.post('/newhunt',upload.fields([{ name: "ibexphotos", maxCount: 5 }, { name: "guidephotos", maxCount: 5 }]), saveNewHuntIbex);
router.post('/topoffer',upload.fields([{ name: "ibexphotos", maxCount: 5 }, { name: "guidephotos", maxCount: 5 }]), saveTopOfferIbex);
router.post('/contactus',sendMail)
router.get('/cloud',getallcloudimages)
router.delete('/deleteall/:publicId',deleteallcloud)
// GET route for fetching all Ibex entries
router.get('/', getAllIbex); 

export { router as IbexRoute };
