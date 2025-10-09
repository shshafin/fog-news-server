"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteFile = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.uploadSingleImage = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path_1.default.join(process.cwd(), "uploads", "jobs");
            // Create directory if it doesn't exist
            if (!fs_1.default.existsSync(uploadPath)) {
                fs_1.default.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
}).single("image");
// Make sure you have these functions in your fileHandlers.ts
const deleteFile = (filename) => {
    const filePath = path_1.default.join(process.cwd(), "uploads", "jobs", filename);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
};
exports.deleteFile = deleteFile;
const getFileUrl = (filename) => {
    return `/uploads/jobs/${filename}`;
};
exports.getFileUrl = getFileUrl;
