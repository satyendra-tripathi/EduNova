import cloudinary from "cloudinary";
import dotenv from "dotenv";

// ✅ Load env here also (safe way)
dotenv.config({ path: "./config/config.env" });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;