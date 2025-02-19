import express, { Express, Request, Response } from 'express';
import {
  saveIbex,
  getallcloudimages,
  deleteallcloud,
  saveTopOfferIbex,
  saveNewHuntIbex,
  sendMail,
  getAllIbex,
  deleteCard,
  updateCard,
  recordMessage,
  displayMessage,
  deleteAdminMessages

} from './ibexs.controller';
import {upload} from '../utility/cloudnary.utils'

const router = express.Router();

// POST route for saving Ibex data with image upload
router.post('/popular', saveIbex);
router.post('/newhunt', saveNewHuntIbex);
router.post('/topoffer', saveTopOfferIbex);
router.post('/contactus',sendMail)
router.delete('/deletecard/:id',deleteCard)
router.put('/updatecard/:id', upload.fields([{ name: "ibexphotos", maxCount: 5 }]),updateCard)
router.get('/cloud',getallcloudimages)
router.delete('/deleteall/:publicId',deleteallcloud)
// GET route for fetching all Ibex entries
router.get('/', getAllIbex); 
router.post('/savemessage',recordMessage)
router.get('/displaythemessage',displayMessage)
router.delete('/deleteadminmessage/:id',deleteAdminMessages)
// router.get('/getallmesagecard')

export { router as IbexRoute };
