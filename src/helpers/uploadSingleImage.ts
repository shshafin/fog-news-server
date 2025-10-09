import multer from "multer";
import path from "path";
import fs from "fs";

export const uploadSingleImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), "uploads", "jobs");
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("image");

// Make sure you have these functions in your fileHandlers.ts
export const deleteFile = (filename: string) => {
  const filePath = path.join(process.cwd(), "uploads", "jobs", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const getFileUrl = (filename: string) => {
  return `/uploads/jobs/${filename}`;
};
