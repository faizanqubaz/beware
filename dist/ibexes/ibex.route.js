"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbexRoute = void 0;
const express_1 = __importDefault(require("express"));
const ibexs_controller_1 = require("./ibexs.controller");
const router = express_1.default.Router();
exports.IbexRoute = router;
// POST route for saving Ibex data with image upload
router.post('/popular', ibexs_controller_1.saveIbex);
router.post('/newhunt', ibexs_controller_1.saveNewHuntIbex);
router.post('/topoffer', ibexs_controller_1.saveTopOfferIbex);
router.post('/contactus', ibexs_controller_1.sendMail);
// GET route for fetching all Ibex entries
router.get('/', ibexs_controller_1.getAllIbex);
