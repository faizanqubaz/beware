"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoute = void 0;
const express_1 = __importDefault(require("express"));
const cloudnary_utils_1 = require("../utility/cloudnary.utils");
const project_controller_1 = require("./project.controller");
const router = express_1.default.Router();
exports.projectRoute = router;
router.post('/create', cloudnary_utils_1.upload.none(), project_controller_1.createProject);
router.get('/getall', project_controller_1.displayProjects);
