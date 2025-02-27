import express, { Response, Request } from 'express';

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Project } from './project.model';
import { v2 as cloudinary } from 'cloudinary';


const createProject = async (req: Request, res: Response) => {
    try {
        let { projectphotos, ibexpublicid } = req.body;
        console.log('req.body',req.body)
        if (Array.isArray(projectphotos)) {
            projectphotos = projectphotos.map((photo, index) => ({
              cloudinary_url: photo,
              cloudinary_id: ibexpublicid ? ibexpublicid[index] : "",
            }));
          }
      
          const newProject = new Project({
            ...req.body,
            projectphotos, // Correct format now
          });
      
          await newProject.save();
          res.status(201).json({ success: true, project: newProject });

    } catch (error) {
        console.log('error',error)
      res.status(500).json({ success: false, message: error });
    }
  };


  
   const displayProjects = async (req: Request, res: Response) => {
    try {
      const { type } = req.query; // Get the type from query params
  
      let filter = {};
      if (type) {
        filter = { projecttype: type }; // Filter by project type
      }
  
      const projects = await Project.find(filter);
  console.log('project',projects)
      res.status(200).json({
        success: true,
        count: projects.length,
        projects,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error });
    }
  };

  const deleteProject = async(req:any,res:any) => {
  try {
    const { publicId } = req.params;

    const project = await Project.findById(publicId);
    console.log('project',project)

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const cloudinaryId = project.projectphotos[0]?.cloudinary_id;
    console.log('cloudid',cloudinaryId)
    if (!cloudinaryId) {
      return res.status(404).json({ message: "Cloudinary ID not found in project photos" });
    }
    // Call Cloudinary to delete the image
    const timeout = (ms:any) =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request Timeout")), ms)
      );

    // Race between Cloudinary request and timeout
    const result = await Promise.race([
      cloudinary.uploader.destroy(cloudinaryId),
      timeout(60000), // 60 seconds timeout
    ]);

    console.log("Cloudinary Response:", result);

    if (result.result === "not found") {
      return res.status(404).json({ message: "Image not found." });
    }

    await Project.findByIdAndDelete(publicId);

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.log('errrr',error)
    res.status(500).json({ error: error });
  }
  }
  


export {

    createProject,
    displayProjects,
    deleteProject
};
