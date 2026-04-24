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
  params: async (_req, file) => ({
    folder: "happyroomie/propiedades",
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
    public_id: `${Date.now()}-${file.fieldname}-${Math.random().toString(36).slice(2, 8)}`,
    transformation:
      file.mimetype.startsWith("image/")
        ? [{ width: 1600, height: 1600, crop: "limit", quality: "auto:good" }]
        : undefined,
  }),
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ok = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
  cb(ok ? null : new Error(`Tipo de archivo no permitido: ${file.mimetype}`), ok);
};

export const uploadPropiedadAssets = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}).any();
