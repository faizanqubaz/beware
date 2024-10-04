"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
exports.userRoute = router;
// router.get('/userbyemail', getAllUserByEmail);
// router.delete('/:userId', deleteUserById);
// router.put('/:userId', updateUserById);
// router.put('/:userId/roles', updateUserRole);
// router.get('/users', getAllUsers);
// router.post('/signup', customSignup);
// router.post('/login', customLogin);
router.post('/', user_controller_1.AuthenticateAdmin);
