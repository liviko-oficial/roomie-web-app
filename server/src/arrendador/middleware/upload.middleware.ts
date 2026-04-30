import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "happyroomie/perfiles",
    resource_type: "image",
    public_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto:good" },
    ],
  }),
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ok = file.mimetype.startsWith("image/");
  cb(ok ? null : new Error(`Tipo de archivo no permitido: ${file.mimetype}`), ok);
};

export const uploadProfilePhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("photo");
