"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_route_1 = require("./users/user.route");
const router = express_1.default.Router();
exports.mainRouter = router;
router.use('/user', user_route_1.userRoute);
