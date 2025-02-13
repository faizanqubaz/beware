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
router.post('/popular', cloudnary_utils_1.upload.fields([{ name: "ibexphotos", maxCount: 5 }, { name: "guidephotos", maxCount: 5 }]), ibexs_controller_1.saveIbex);
router.post('/newhunt', cloudnary_utils_1.upload.fields([{ name: "ibexphotos", maxCount: 5 }, { name: "guidephotos", maxCount: 5 }]), ibexs_controller_1.saveNewHuntIbex);
router.post('/topoffer', cloudnary_utils_1.upload.fields([{ name: "ibexphotos", maxCount: 5 }, { name: "guidephotos", maxCount: 5 }]), ibexs_controller_1.saveTopOfferIbex);
router.post('/contactus', ibexs_controller_1.sendMail);
router.get('/cloud', ibexs_controller_1.getallcloudimages);
router.delete('/deleteall/:publicId', ibexs_controller_1.deleteallcloud);
// GET route for fetching all Ibex entries
router.get('/', ibexs_controller_1.getAllIbex);
