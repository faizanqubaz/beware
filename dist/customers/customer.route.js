"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const customers_controller_1 = require("./customers.controller");
const router = express_1.default.Router();
exports.customerRoute = router;
router.post('/sendinvite', customers_controller_1.SendInvite);
router.get('/confirmation-link', customers_controller_1.saveTheUser);
router.get('/customers', customers_controller_1.getAllCustomersBySender);
router.get('/callback', customers_controller_1.getAuthorizationCode);
