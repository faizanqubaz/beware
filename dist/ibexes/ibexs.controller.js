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
exports.updateCard = exports.deleteCard = exports.sendMail = exports.saveNewHuntIbex = exports.saveTopOfferIbex = exports.deleteallcloud = exports.getallcloudimages = exports.getAllIbex = exports.saveIbex = exports.recordMessage = exports.deleteAdminMessages = exports.displayMessage = void 0;
const ibex_model_1 = require("./ibex.model");
const message_model_1 = require("./message.model");
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
        const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, // This is a string like "16/01/2025"
        priceOld, hunterlocation, ibexphotos, // Cloudinary URLs from frontend
        ibexpublicid, // Cloudinary public IDs from frontend
        guidepublicid, // Cloudinary public IDs for guides
        guidephotos, // Cloudinary URLs for guides
         } = req.body;
        console.log("Request Body:", req.body);
        // Convert huntdate from "DD/MM/YYYY" to a JavaScript Date object
        const [day, month, year] = huntdate.split("/");
        const formattedHuntDate = new Date(`${year}-${month}-${day}`);
        if (isNaN(formattedHuntDate.getTime())) {
            return res.status(400).json({ message: "Invalid huntdate format. Use DD/MM/YYYY." });
        }
        // Ensure ibexphotos and ibexpublicid are arrays before mapping
        const formattedIbexPhotos = Array.isArray(ibexphotos) && Array.isArray(ibexpublicid)
            ? ibexphotos.map((url, index) => ({
                cloudinary_url: url,
                cloudinary_id: ibexpublicid[index] || null,
            }))
            : [];
        // Ensure guidephotos and guidepublicid are arrays before mapping
        const formattedGuidePhotos = Array.isArray(guidephotos) && Array.isArray(guidepublicid)
            ? guidephotos.map((url, index) => ({
                cloudinary_url: url,
                cloudinary_id: guidepublicid[index] || null,
            }))
            : [];
        console.log('formateddd', formattedGuidePhotos);
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
            ibexphotos: formattedIbexPhotos, // Correct format for MongoDB
            guidephotos: formattedGuidePhotos, // Correct format for MongoDB
            priceOld,
            hunterlocation,
            huntType: "populartype",
        });
        const savedIbex = yield ibex.save();
        console.log("Saved Ibex:", savedIbex);
        return res.status(201).json({
            message: "Popular hunt created successfully!",
            ibex: savedIbex,
        });
    }
    catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
});
exports.saveIbex = saveIbex;
const saveTopOfferIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, // This is a string like "16/01/2025"
        priceOld, hunterlocation, ibexphotos, guidephotos } = req.body;
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
            ibexphotos: ibexphotos,
            guidephotos: guidephotos,
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
        const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, // This is a string like "16/01/2025"
        priceOld, hunterlocation, ibexphotos, guidephotos, } = req.body;
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
            ibexphotos: ibexphotos,
            guidephotos: guidephotos,
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
        console.log('id', id);
        const updatedData = {
            description: req.body.description,
            ibexrate: req.body.ibexrate,
            priceOld: req.body.priceOld,
            newPrice: req.body.newPrice,
            huntdate: req.body.huntdate,
        };
        console.log('updated', updatedData);
        // Retrieve the existing Ibex document from the database.
        const existingIbex = yield ibex_model_1.Ibex.findById(id);
        if (!existingIbex) {
            return res.status(404).json({ message: "Ibex not found" });
        }
        console.log('existing', existingIbex);
        // Check if there are new photos provided in the request.
        if (req.files &&
            req.files.ibexphotos &&
            Array.isArray(req.files.ibexphotos) &&
            req.files.ibexphotos.length > 0) {
            //   // Access the first file from the "ibexphotos" field.
            const file = req.files.ibexphotos[0];
            console.log('New file path:', file.path);
            // Retrieve the current public_id from the existing document (if available).
            let oldPublicId;
            if (existingIbex.ibexphotos &&
                existingIbex.ibexphotos.length > 0 &&
                existingIbex.ibexphotos[0].cloudinary_id) {
                oldPublicId = existingIbex.ibexphotos[0].cloudinary_id;
            }
            // Upload the new file to Cloudinary with overwrite enabled.
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                public_id: oldPublicId,
                overwrite: true,
            });
            console.log('Cloudinary upload result:', result);
            //   // Update the ibexphotos field with the new data.
            updatedData.ibexphotos = [
                {
                    cloudinary_url: result.secure_url,
                    cloudinary_id: result.public_id,
                },
            ];
        }
        // console.log('updateddata', updatedData);
        // Update the document in the database.
        const updatedIbex = yield ibex_model_1.Ibex.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedIbex) {
            return res.status(404).json({ message: "Ibex not found after update" });
        }
        console.log('updatedibex', updatedIbex);
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
const recordMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const newMessage = new message_model_1.IbexMessage({ message: message });
        yield newMessage.save();
        res.status(201).json({ success: true, message: 'Message saved successfully' });
    }
    catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Failed to save message' });
    }
});
exports.recordMessage = recordMessage;
const displayMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestMessage = yield message_model_1.IbexMessage.find().sort({ createdAt: -1 }); // Get the most recent message
        if (!latestMessage) {
            return res.json({ message: "" }); // If no message exists, return an empty message
        }
        console.log('latest', latestMessage);
        res.json({ message: latestMessage }); // Send the latest message
    }
    catch (error) {
        console.error("Error fetching message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.displayMessage = displayMessage;
const deleteAdminMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = req.params.id;
        const deletedMessage = yield message_model_1.IbexMessage.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        res.json({ success: true, message: "Message deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteAdminMessages = deleteAdminMessages;
