"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayProjects = exports.createProject = void 0;
const project_model_1 = require("./project.model");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { projectphotos, ibexpublicid } = req.body;
        console.log('req.body', req.body);
        if (Array.isArray(projectphotos)) {
            projectphotos = projectphotos.map((photo, index) => ({
                cloudinary_url: photo,
                cloudinary_id: ibexpublicid ? ibexpublicid[index] : "",
            }));
        }
        const newProject = new project_model_1.Project(Object.assign(Object.assign({}, req.body), { projectphotos }));
        yield newProject.save();
        res.status(201).json({ success: true, project: newProject });
    }
    catch (error) {
        console.log('error', error);
        res.status(500).json({ success: false, message: error });
    }
});
exports.createProject = createProject;
const displayProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.query; // Get the type from query params
        let filter = {};
        if (type) {
            filter = { projecttype: type }; // Filter by project type
        }
        const projects = yield project_model_1.Project.find(filter);
        console.log('project', projects);
        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error });
    }
});
exports.displayProjects = displayProjects;
