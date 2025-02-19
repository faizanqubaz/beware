"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbexRoute = void 0;
const express_1 = __importDefault(require("express"));
const ibexs_controller_1 = require("./ibexs.controller");
const cloudnary_utils_1 = require("../utility/cloudnary.utils");
const router = express_1.default.Router();
exports.IbexRoute = router;
// POST route for saving Ibex data with image upload
router.post('/popular', ibexs_controller_1.saveIbex);
router.post('/newhunt', ibexs_controller_1.saveNewHuntIbex);
router.post('/topoffer', ibexs_controller_1.saveTopOfferIbex);
router.post('/contactus', ibexs_controller_1.sendMail);
router.delete('/deletecard/:id', ibexs_controller_1.deleteCard);
router.put('/updatecard/:id', cloudnary_utils_1.upload.fields([{ name: "ibexphotos", maxCount: 5 }]), ibexs_controller_1.updateCard);
router.get('/cloud', ibexs_controller_1.getallcloudimages);
router.delete('/deleteall/:publicId', ibexs_controller_1.deleteallcloud);
// GET route for fetching all Ibex entries
router.get('/', ibexs_controller_1.getAllIbex);
router.post('/savemessage', ibexs_controller_1.recordMessage);
router.get('/displaythemessage', ibexs_controller_1.displayMessage);
router.delete('/deleteadminmessage/:id', ibexs_controller_1.deleteAdminMessages);
