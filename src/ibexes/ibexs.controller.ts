import { Request, Response } from 'express';
import { Ibex } from './ibex.model';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // For file system operations
import { AnyNsRecord } from 'dns';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dyds5ol3y',
  api_key: '214534318241163',
  api_secret: 'qxGY3QFqcJN1KYeTo8k21_rapsw'
});

const getallcloudimages = async(req:any,res:any) =>{
  try {
    const result = await cloudinary.api.resources({ type: "upload", resource_type: "image" });
    res.json(result.resources);
  } catch (error) {
   console.log(error)
  }
}
 


// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'uploads/'); // The folder where images will be stored
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);


  }
});

// Define accepted file types (e.g., JPEG, PNG)
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: (error: (Error | null), acceptFile?: boolean) => void) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    console.log('this is running dude',file.mimetype)
    cb(null, true); // No error, accept file
  } else {
    cb(new Error('Unsupported file type'), false); // Return error for unsupported file type
  }
};
// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter
}).fields([
  { name: 'ibexphotos', maxCount: 5 }, // Handle multiple ibex images
  { name: 'guidephotos', maxCount: 5 }  // Handle multiple guide images
]);

const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload to Cloudinary');
  }
};

// Save new Ibex to the database
const saveIbex = async (req: Request, res: Response) => {
  console.log('iam runnng')
  upload(req, res, async (err: any) => {
    if (err) {
      console.log('err', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }
console.log('not an issue with multer')
    try {
      const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;

      const ibexphotos = (req.files as any)?.ibexphotos.map((file: Express.Multer.File) => file.path) || [];
      const guidephotos = (req.files as any)?.guidephotos.map((file: Express.Multer.File) => file.path) || [];
      // Upload each image to Cloudinary and get URLs
      const ibexphotosCloudinary = await Promise.all(
        ibexphotos.map(async (filePath: string) => {
          const cloudinaryUrl = await uploadToCloudinary(filePath);
          return cloudinaryUrl; // Return Cloudinary URL
        })
      );

      const guidephotosCloudinary = await Promise.all(
        guidephotos.map(async (filePath: string) => {
          const cloudinaryUrl = await uploadToCloudinary(filePath);
          return cloudinaryUrl; // Return Cloudinary URL
        })
      );
      const ibex = new Ibex({
        ibexname,
        description,
        ibexrate,
        guideName,
        latitude,
        longitude, // Save latitude and longitude instead of location
        ibexsize,
        newPrice,
        huntername,
        huntdate,
        ibexphotos: ibexphotosCloudinary,
        guidephotos: guidephotosCloudinary,
        priceOld,
        hunterlocation,
        huntType: "populartype"
      });

      const savedIbex = await ibex.save();
      console.log('saved', savedIbex);
      res.status(201).json({ message: 'Ibex created successfully', data: savedIbex });
    } catch (error: any) {
      res.status(500).json({ message: 'Error saving Ibex', error: error.message });
    }
    finally {
      // Optionally remove the local files after uploading to Cloudinary

    }
  });
};

const saveTopOfferIbex = async (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    if (err) {
      console.log('err', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    try {
      const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;

      const ibexphotos = (req.files as any)?.ibexphotos.map((file: Express.Multer.File) => file.path) || [];
      const guidephotos = (req.files as any)?.guidephotos.map((file: Express.Multer.File) => file.path) || [];
      // Upload each image to Cloudinary and get URLs
      const ibexphotosCloudinary = await Promise.all(
        ibexphotos.map(async (filePath: string) => {
          const cloudinaryUrl = await uploadToCloudinary(filePath);
          return cloudinaryUrl; // Return Cloudinary URL
        })
      );

      const guidephotosCloudinary = await Promise.all(
        guidephotos.map(async (filePath: string) => {
          const cloudinaryUrl = await uploadToCloudinary(filePath);
          return cloudinaryUrl; // Return Cloudinary URL
        })
      );
      const ibex = new Ibex({
        ibexname,
        description,
        ibexrate,
        guideName,
        latitude,
        longitude, // Save latitude and longitude instead of location
        ibexsize,
        newPrice,
        huntername,
        huntdate,
        ibexphotos: ibexphotosCloudinary,
        guidephotos: guidephotosCloudinary,
        priceOld,
        hunterlocation,
        huntType: "topoffertype"
      });

      const savedIbex = await ibex.save();
      console.log('saved', savedIbex);
      res.status(201).json({ message: 'Ibex created successfully', data: savedIbex });
    } catch (error: any) {
      res.status(500).json({ message: 'Error saving Ibex', error: error.message });
    }
  });
};

const saveNewHuntIbex = async (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    if (err) {
      console.log('err', err);
      return res.status(500).json({ message: 'Error uploading files', error: err.message });
    }

    try {
      const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;

      const ibexphotos = (req.files as any)?.ibexphotos.map((file: Express.Multer.File) => file.path) || [];
      const guidephotos = (req.files as any)?.guidephotos.map((file: Express.Multer.File) => file.path) || [];
      const ibexphotosCloudinary = await Promise.all(
        ibexphotos.map(async (filePath: string) => {
          const cloudinaryUrl = await uploadToCloudinary(filePath);
          return cloudinaryUrl; // Return Cloudinary URL
        })
      );

      const guidephotosCloudinary = await Promise.all(
        guidephotos.map(async (filePath: string) => {
          const cloudinaryUrl = await uploadToCloudinary(filePath);
          return cloudinaryUrl; // Return Cloudinary URL
        })
      );
      const ibex = new Ibex({
        ibexname,
        description,
        ibexrate,
        guideName,
        latitude,
        longitude, // Save latitude and longitude instead of location
        ibexsize,
        newPrice,
        huntername,
        huntdate,
        ibexphotos: ibexphotosCloudinary,
        guidephotos: guidephotosCloudinary,
        priceOld,
        hunterlocation,
        huntType: "newhunttype"
      });

      const savedIbex = await ibex.save();
      res.status(201).json({ message: 'Ibex created successfully', data: savedIbex });
    } catch (error: any) {
      res.status(500).json({ message: 'Error saving Ibex', error: error.message });
    }
  });
};

// Get all Ibex entries
const getAllIbex = async (req: Request, res: Response) => {
  try {
    const { hunttype } = req.query;

    // Fetch all Ibex entries or filter by hunttype
    const ibexList = await Ibex.find({ huntType: hunttype });

    // Map through the ibex entries to append full image URIs



    // Return the list of Ibex entries with full image URIs
    res.status(200).json({
      message: 'Ibex entries retrieved successfully',
      data: ibexList
    });
  } catch (error: any) {
    console.error('Error fetching Ibex entries:', error);
    res.status(500).json({ message: 'Failed to fetch Ibex entries', error: error.message });
  }
};

// Send an email using Nodemailer
const sendMail = async (req: Request, res: Response) => {
  const { name, phone, email, country, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nukhan55@gmail.com',
      pass: 'lqrbzmlnukrztucv'
    }
  });

  const mailOptions = {
    from: email,
    to: 'faizanquba1@gmail.com', // The email to send to
    subject: subject,
    text: `Name: ${name}\nPhone: ${phone}\nCountry: ${country}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
};

const deleteallcloud = async(req:any,res:any) => {
  try {
    const { publicId } = req.params;

    // Call Cloudinary to delete the image
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "not found") {
      return res.status(404).json({ message: "Image not found." });
    }

    res.status(200).json({ message: "Image deleted successfully.", result });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export { saveIbex, saveNewHuntIbex, saveTopOfferIbex, getAllIbex, sendMail,getallcloudimages,deleteallcloud };
