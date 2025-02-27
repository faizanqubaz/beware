import express, { Express, Request, Response } from 'express';
import {upload} from '../utility/cloudnary.utils'
import {
  // deleteUserById,
  // getAllUserByEmail,
  // updateUserById,
  // updateUserRole,
  // getAllUsers,
  // customSignup,
  // customLogin,
  displayProjects,
  deleteProject,
  createProject
} from './project.controller';
const router = express.Router();


router.post('/create',upload.none(), createProject);
router.get('/getall', displayProjects);
router.delete('/deleteprojects/:publicId',deleteProject)

export { router as projectRoute };
