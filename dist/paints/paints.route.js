"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paintsRoute = void 0;
const express_1 = __importDefault(require("express"));
const paints_controller_1 = require("./paints.controller");
const router = express_1.default.Router();
exports.paintsRoute = router;
router.post('/:customerId/save', paints_controller_1.savePaintsofCustomer);
router.get('/:customerId/paints', paints_controller_1.getCustomerWithPaints);
