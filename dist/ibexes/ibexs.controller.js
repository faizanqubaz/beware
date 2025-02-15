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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCard = exports.deleteCard = exports.sendMail = exports.saveNewHuntIbex = exports.saveTopOfferIbex = exports.deleteallcloud = exports.getallcloudimages = exports.getAllIbex = exports.saveIbex = void 0;
const ibex_model_1 = require("./ibex.model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
// cloudinary.config({
//   cloud_name: 'dyds5ol3y',
//   api_key: '214534318241163',
//   api_secret: 'qxGY3QFqcJN1KYeTo8k21_rapsw'
// });
// const storage = multer.memoryStorage(); // Store images in memory before uploading to Cloudinary
// const uploads = multer({ storage });
const getallcloudimages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.api.resources({ type: "upload", resource_type: "image" });
        res.json(result.resources);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getallcloudimages = getallcloudimages;
const deleteCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log('id', id);
        // Find the Ibex document
        const ibex = yield ibex_model_1.Ibex.findById(id);
        console.log('ibexfound', ibex);
        if (!ibex)
            return res.status(404).json({ message: "Ibex not found" });
        // Ensure that ibexphotos and guidephotos are arrays of objects
        if (Array.isArray(ibex.ibexphotos)) {
            for (const photo of ibex.ibexphotos) {
                if (photo.cloudinary_id) {
                    yield cloudinary_1.v2.uploader.destroy(photo.cloudinary_id);
                }
            }
        }
        if (Array.isArray(ibex.guidephotos)) {
            for (const photo of ibex.guidephotos) {
                if (photo.cloudinary_id) {
                    yield cloudinary_1.v2.uploader.destroy(photo.cloudinary_id);
                }
            }
        }
        // Delete the document from MongoDB
        yield ibex_model_1.Ibex.findByIdAndDelete(id);
        console.log('juu');
        res.status(200).json({ message: "Ibex deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting Ibex", error: error });
    }
});
exports.deleteCard = deleteCard;
// Configure multer for image uploads
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "uploads", // Save to 'uploads' folder in Cloudinary
//     format: async () => "png", // Convert all uploads to PNG format
//     public_id: (req:any, file:any) => file.originalname.split(".")[0], // Use filename as public_id
//   } as Record<string, unknown>, // 👈 Explicit type assertion to avoid TS error
// });
// Multer middleware
// const uploadss = multer({ storage });
// Define accepted file types (e.g., JPEG, PNG)
// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: (error: (Error | null), acceptFile?: boolean) => void) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     console.log('this is running dude',file.mimetype)
//     cb(null, true); // No error, accept file
//   } else {
//     cb(new Error('Unsupported file type'), false); // Return error for unsupported file type
//   }
// };
// Initialize multer upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
//   fileFilter: fileFilter
// }).fields([
//   { name: 'ibexphotos', maxCount: 5 }, // Handle multiple ibex images
//   { name: 'guidephotos', maxCount: 5 }  // Handle multiple guide images
// ]);
// const uploadToCloudinary = async (filePath: string) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath);
//     return result.secure_url; // Return the Cloudinary URL
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw new Error('Failed to upload to Cloudinary');
//   }
// };
// Save new Ibex to the database
const saveIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ibexphotos = req.files["ibexphotos"] || [];
        const guidephotos = req.files["guidephotos"] || [];
        // Extract Cloudinary URLs and Public IDs
        const ibexphotosData = ibexphotos.map((file) => ({
            cloudinary_url: file.path, // Cloudinary URL
            cloudinary_id: file.filename, // Cloudinary Public ID
        }));
        const guidephotosData = guidephotos.map((file) => ({
            cloudinary_url: file.path, // Cloudinary URL
            cloudinary_id: file.filename, // Cloudinary Public ID
        }));
        console.log("Guide Photo IDs:", guidephotosData);
        const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, // This is a string like "16/01/2025"
        priceOld, hunterlocation, } = req.body;
        // Convert huntdate from "DD/MM/YYYY" to a JavaScript Date object
        const [day, month, year] = huntdate.split('/'); // Split the string
        const formattedHuntDate = new Date(`${year}-${month}-${day}`); // Convert to "YYYY-MM-DD"
        if (isNaN(formattedHuntDate.getTime())) {
            return res.status(400).json({ message: "Invalid huntdate format. Use DD/MM/YYYY." });
        }
        // Save to MongoDB
        const ibex = new ibex_model_1.Ibex({
            ibexname,
            description,
            ibexrate,
            guideName,
            latitude,
            longitude,
            ibexsize,
            newPrice,
            huntername,
            huntdate: formattedHuntDate, // Use the properly formatted date
            ibexphotos: ibexphotosData, // Array with cloudinary_url & cloudinary_id
            guidephotos: guidephotosData, // Array with cloudinary_url & cloudinary_id
            priceOld,
            hunterlocation,
            huntType: "populartype",
        });
        const savedIbex = yield ibex.save();
        return res.status(201).json({
            message: "Popular hunt created successfully!",
            ibex: savedIbex,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error processing files", error: error.message });
    }
});
exports.saveIbex = saveIbex;
const saveTopOfferIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ibextopofferphotos = req.files["ibexphotos"] || [];
        const guidetopofferphotos = req.files["guidephotos"] || [];
        // Extract Cloudinary URLs and Public IDs
        const ibexphotosData = ibextopofferphotos.map((file) => ({
            cloudinary_url: file.path, // Cloudinary URL
            cloudinary_id: file.filename, // Cloudinary Public ID
        }));
        const guidephotosData = guidetopofferphotos.map((file) => ({
            cloudinary_url: file.path, // Cloudinary URL
            cloudinary_id: file.filename, // Cloudinary Public ID
        }));
        const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;
        // Convert huntdate from "DD/MM/YYYY" to a JavaScript Date object
        const [day, month, year] = huntdate.split('/'); // Split the string
        const formattedHuntDate = new Date(`${year}-${month}-${day}`); // Convert to "YYYY-MM-DD"
        if (isNaN(formattedHuntDate.getTime())) {
            return res.status(400).json({ message: "Invalid huntdate format. Use DD/MM/YYYY." });
        }
        const ibex = new ibex_model_1.Ibex({
            ibexname,
            description,
            ibexrate,
            guideName,
            latitude,
            longitude, // Save latitude and longitude instead of location
            ibexsize,
            newPrice,
            huntername,
            huntdate: formattedHuntDate,
            ibexphotos: ibexphotosData,
            guidephotos: guidephotosData,
            priceOld,
            hunterlocation,
            huntType: "topoffertype"
        });
        const savedIbex = yield ibex.save();
        res.status(201).json({ message: 'Ibex created successfully', data: savedIbex });
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving Ibex', error: error.message });
    }
});
exports.saveTopOfferIbex = saveTopOfferIbex;
const saveNewHuntIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ibexNewHuntphotos = req.files["ibexphotos"] || [];
        const guideNewHuntphotos = req.files["guidephotos"] || [];
        console.log('ibexphotos', ibexNewHuntphotos);
        // Extract Cloudinary URLs and Public IDs
        const ibexphotosData = ibexNewHuntphotos.map((file) => ({
            cloudinary_url: file.path, // Cloudinary URL
            cloudinary_id: file.filename, // Cloudinary Public ID
        }));
        const guidephotosData = guideNewHuntphotos.map((file) => ({
            cloudinary_url: file.path, // Cloudinary URL
            cloudinary_id: file.filename, // Cloudinary Public ID
        }));
        const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;
        // Convert huntdate from "DD/MM/YYYY" to a JavaScript Date object
        const [day, month, year] = huntdate.split('/'); // Split the string
        const formattedHuntDate = new Date(`${year}-${month}-${day}`); // Convert to "YYYY-MM-DD"
        if (isNaN(formattedHuntDate.getTime())) {
            return res.status(400).json({ message: "Invalid huntdate format. Use DD/MM/YYYY." });
        }
        const ibex = new ibex_model_1.Ibex({
            ibexname,
            description,
            ibexrate,
            guideName,
            latitude,
            longitude, // Save latitude and longitude instead of location
            ibexsize,
            newPrice,
            huntername,
            huntdate: formattedHuntDate,
            ibexphotos: ibexphotosData,
            guidephotos: guidephotosData,
            priceOld,
            hunterlocation,
            huntType: "newhunttype"
        });
        const savedIbex = yield ibex.save();
        res.status(201).json({ message: 'Ibex created successfully', data: savedIbex });
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving Ibex', error: error.message });
    }
});
exports.saveNewHuntIbex = saveNewHuntIbex;
// Get all Ibex entries
const getAllIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hunttype } = req.query;
        // Fetch Ibex entries based on hunttype (if provided)
        const ibexList = hunttype
            ? yield ibex_model_1.Ibex.find({ huntType: hunttype }) // Filter by hunttype
            : yield ibex_model_1.Ibex.find(); // Fetch all if hunttype is not provided
        res.status(200).json({
            message: 'Ibex entries retrieved successfully',
            data: ibexList,
        });
    }
    catch (error) {
        console.error('Error fetching Ibex entries:', error);
        res.status(500).json({ message: 'Failed to fetch Ibex entries', error: error.message });
    }
});
exports.getAllIbex = getAllIbex;
// Send an email using Nodemailer
const sendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, country, subject, message } = req.body;
    const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});
exports.sendMail = sendMail;
const updateCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = {
            description: req.body.description,
            ibexrate: req.body.ibexrate,
            guideName: req.body.guideName,
            ibexsize: req.body.ibexsize,
            priceOld: req.body.priceOld,
            newPrice: req.body.newPrice,
            huntername: req.body.huntername,
            hunterlocation: req.body.hunterlocation,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            huntdate: req.body.huntdate,
            huntType: req.body.huntType,
            ibexname: req.body.ibexname,
        };
        // Handle new photos if provided
        if (req.files && Array.isArray(req.files)) {
            const uploadedPhotos = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield cloudinary_1.v2.uploader.upload(file.path);
                return {
                    cloudinary_url: result.secure_url,
                    cloudinary_id: result.public_id,
                };
            })));
            updatedData.ibexphotos = uploadedPhotos; // Now TypeScript recognizes this property
        }
        const updatedIbex = yield ibex_model_1.Ibex.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedIbex) {
            return res.status(404).json({ message: "Ibex not found" });
        }
        res.status(200).json({ message: "Ibex card updated successfully", updatedIbex });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Ibex card", error: error });
    }
});
exports.updateCard = updateCard;
const deleteallcloud = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicId } = req.params;
        // Call Cloudinary to delete the image
        const result = yield cloudinary_1.v2.uploader.destroy(publicId);
        if (result.result === "not found") {
            return res.status(404).json({ message: "Image not found." });
        }
        res.status(200).json({ message: "Image deleted successfully.", result });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
exports.deleteallcloud = deleteallcloud;
