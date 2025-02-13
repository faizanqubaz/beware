import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dyds5ol3y',
    api_key: '214534318241163',
    api_secret: 'qxGY3QFqcJN1KYeTo8k21_rapsw'
});

const generatePublicId = () =>
    `ibex_uploads_ibexuploads_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
// Define Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    format: "jpg", // Change format if needed
    public_id: generatePublicId(), // ✅ Generates a unique public_id without "/"
  }),
});

// Initialize Multer with Cloudinary Storage
const upload = multer({ storage });

export { upload, cloudinary };
