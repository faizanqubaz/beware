import express, { Express, Request, Response } from 'express';
import {
  saveIbex,
  saveNewHuntIbex,
  saveTopOfferIbex,
  sendMail,
  getAllIbex,
  getallcloudimages,
deleteallcloud
} from './ibexs.controller';


const router = express.Router();

// POST route for saving Ibex data with image upload
router.post('/popular', saveIbex);
router.post('/newhunt', saveNewHuntIbex);
router.post('/topoffer', saveTopOfferIbex);
router.post('/contactus',sendMail)
router.get('/cloud',getallcloudimages)
router.delete('/deleteall/:publicId',deleteallcloud)
// GET route for fetching all Ibex entries
router.get('/', getAllIbex); 

export { router as IbexRoute };
