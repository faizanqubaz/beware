"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = __importDefault(require("express"));
// import { customerRoute } from './customers/customer.route';
const user_route_1 = require("./users/user.route");
const ibex_route_1 = require("./ibexes/ibex.route");
const router = express_1.default.Router();
exports.mainRouter = router;
router.use('/ibex', ibex_route_1.IbexRoute);
router.use('/login', user_route_1.userRoute);
