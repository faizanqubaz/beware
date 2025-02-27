"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
    projectname: { type: String, required: true },
    description: { type: String, required: true },
    projectcost: { type: String, required: true },
    projectfor: { type: String, required: true },
    projecttype: { type: String, required: true, enum: ["pending", "completed", "future", "cancelled"] },
    summary: { type: String, required: true },
    completiondate: { type: Date, required: true },
    startdate: { type: Date, required: true },
    lastdate: { type: Date, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    huntername: { type: String },
    hunterlocation: { type: String },
    ibexsize: { type: String },
    priceOld: { type: String },
    ibexphotos: [
        {
            cloudinary_url: { type: String, required: true },
            cloudinary_id: { type: String, required: true },
        },
    ],
    projectphotos: [
        {
            cloudinary_url: { type: String, required: true },
            cloudinary_id: { type: String, required: true },
        },
    ],
});
exports.Project = mongoose_1.default.model("Project", ProjectSchema);
