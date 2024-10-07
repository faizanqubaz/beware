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
exports.sendMail = exports.getAllIbex = exports.saveTopOfferIbex = exports.saveNewHuntIbex = exports.saveIbex = void 0;
const ibex_model_1 = require("./ibex.model");
const multer_1 = __importDefault(require("multer"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: 'dyds5ol3y',
    api_key: '214534318241163',
    api_secret: 'qxGY3QFqcJN1KYeTo8k21_rapsw'
});
// Configure multer for image uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // The folder where images will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
// Define accepted file types (e.g., JPEG, PNG)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // No error, accept file
    }
    else {
        cb(new Error('Unsupported file type'), false); // Return error for unsupported file type
    }
};
// Initialize multer upload
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: fileFilter
}).fields([
    { name: 'ibexphotos', maxCount: 5 }, // Handle multiple ibex images
    { name: 'guidephotos', maxCount: 5 } // Handle multiple guide images
]);
const uploadToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(filePath);
        return result.secure_url; // Return the Cloudinary URL
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload to Cloudinary');
    }
});
// Save new Ibex to the database
const saveIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (err) {
            console.log('err', err);
            return res.status(500).json({ message: 'Error uploading files', error: err.message });
        }
        try {
            const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;
            const ibexphotos = ((_a = req.files) === null || _a === void 0 ? void 0 : _a.ibexphotos.map((file) => file.path)) || [];
            const guidephotos = ((_b = req.files) === null || _b === void 0 ? void 0 : _b.guidephotos.map((file) => file.path)) || [];
            // Upload each image to Cloudinary and get URLs
            const ibexphotosCloudinary = yield Promise.all(ibexphotos.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
                const cloudinaryUrl = yield uploadToCloudinary(filePath);
                return cloudinaryUrl; // Return Cloudinary URL
            })));
            const guidephotosCloudinary = yield Promise.all(guidephotos.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
                const cloudinaryUrl = yield uploadToCloudinary(filePath);
                return cloudinaryUrl; // Return Cloudinary URL
            })));
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
                huntdate,
                ibexphotos: ibexphotosCloudinary,
                guidephotos: guidephotosCloudinary,
                priceOld,
                hunterlocation,
                huntType: "populartype"
            });
            const savedIbex = yield ibex.save();
            console.log('saved', savedIbex);
            res.status(201).json({ message: 'Ibex created successfully', data: savedIbex });
        }
        catch (error) {
            res.status(500).json({ message: 'Error saving Ibex', error: error.message });
        }
        finally {
            // Optionally remove the local files after uploading to Cloudinary
        }
    }));
});
exports.saveIbex = saveIbex;
const saveTopOfferIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        if (err) {
            console.log('err', err);
            return res.status(500).json({ message: 'Error uploading files', error: err.message });
        }
        try {
            const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;
            const ibexphotos = ((_c = req.files) === null || _c === void 0 ? void 0 : _c.ibexphotos.map((file) => file.path)) || [];
            const guidephotos = ((_d = req.files) === null || _d === void 0 ? void 0 : _d.guidephotos.map((file) => file.path)) || [];
            // Upload each image to Cloudinary and get URLs
            const ibexphotosCloudinary = yield Promise.all(ibexphotos.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
                const cloudinaryUrl = yield uploadToCloudinary(filePath);
                return cloudinaryUrl; // Return Cloudinary URL
            })));
            const guidephotosCloudinary = yield Promise.all(guidephotos.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
                const cloudinaryUrl = yield uploadToCloudinary(filePath);
                return cloudinaryUrl; // Return Cloudinary URL
            })));
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
                huntdate,
                ibexphotos: ibexphotosCloudinary,
                guidephotos: guidephotosCloudinary,
                priceOld,
                hunterlocation,
                huntType: "topoffertype"
            });
            const savedIbex = yield ibex.save();
            console.log('saved', savedIbex);
            res.status(201).json({ message: 'Ibex created successfully', data: savedIbex });
        }
        catch (error) {
            res.status(500).json({ message: 'Error saving Ibex', error: error.message });
        }
    }));
});
exports.saveTopOfferIbex = saveTopOfferIbex;
const saveNewHuntIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f;
        if (err) {
            console.log('err', err);
            return res.status(500).json({ message: 'Error uploading files', error: err.message });
        }
        try {
            const { ibexname, description, ibexrate, guideName, latitude, longitude, ibexsize, newPrice, huntername, huntdate, priceOld, hunterlocation } = req.body;
            const ibexphotos = ((_e = req.files) === null || _e === void 0 ? void 0 : _e.ibexphotos.map((file) => file.path)) || [];
            const guidephotos = ((_f = req.files) === null || _f === void 0 ? void 0 : _f.guidephotos.map((file) => file.path)) || [];
            const ibexphotosCloudinary = yield Promise.all(ibexphotos.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
                const cloudinaryUrl = yield uploadToCloudinary(filePath);
                return cloudinaryUrl; // Return Cloudinary URL
            })));
            const guidephotosCloudinary = yield Promise.all(guidephotos.map((filePath) => __awaiter(void 0, void 0, void 0, function* () {
                const cloudinaryUrl = yield uploadToCloudinary(filePath);
                return cloudinaryUrl; // Return Cloudinary URL
            })));
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
                huntdate,
                ibexphotos: ibexphotosCloudinary,
                guidephotos: guidephotosCloudinary,
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
    }));
});
exports.saveNewHuntIbex = saveNewHuntIbex;
// Get all Ibex entries
const getAllIbex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hunttype } = req.query;
        // Fetch all Ibex entries or filter by hunttype
        const ibexList = yield ibex_model_1.Ibex.find({ huntType: hunttype });
        // Map through the ibex entries to append full image URIs
        // Return the list of Ibex entries with full image URIs
        res.status(200).json({
            message: 'Ibex entries retrieved successfully',
            data: ibexList
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
