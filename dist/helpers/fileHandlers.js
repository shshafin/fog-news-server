"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.getResumeUrl = exports.uploadResume = exports.uploadEntertainmentFiles = exports.handleUploadError = exports.uploadEpaperFiles = exports.deleteFile = exports.getFileUrl = exports.uploadFiles = exports.uploadFile = exports.uploadImages = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../public/storage");
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const resumeStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../public/storage/applications");
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});
const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
};
const fileFilter = (req, file, cb) => {
    cb(null, true);
};
const resumeFilter = (req, file, cb) => {
    const allowedFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF and Word documents are allowed"));
    }
};
exports.uploadImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");
exports.uploadImages = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 10 },
}).array("images", 10);
exports.uploadFile = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 },
}).single("file");
exports.uploadFiles = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024, files: 10 },
}).array("files", 10);
const getFileUrl = (filename) => {
    return `/storage/${filename}`;
};
exports.getFileUrl = getFileUrl;
const deleteFile = (filename) => {
    const filePath = path_1.default.join(__dirname, "../../public/storage", filename);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
        return true;
    }
    return false;
};
exports.deleteFile = deleteFile;
// Add this to fileHandler.ts
exports.uploadEpaperFiles = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "file") {
            // Allow images and PDF for main file
            if (file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg" ||
                file.mimetype === "application/pdf") {
                cb(null, true);
            }
            else {
                cb(new Error("Main file must be image (PNG/JPG/JPEG) or PDF"));
            }
        }
        else if (file.fieldname === "thumbnail") {
            // Only allow images for thumbnail
            if (file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg") {
                cb(null, true);
            }
            else {
                cb(new Error("Thumbnail must be an image (PNG/JPG/JPEG)"));
            }
        }
        else {
            cb(new Error("Unexpected field"));
        }
    },
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB per file
        files: 2, // Allow 2 files (file + thumbnail)
    },
}).fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]);
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    else if (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "File upload failed",
        });
    }
    next();
};
exports.handleUploadError = handleUploadError;
// Add to fileHandlers.ts
exports.uploadEntertainmentFiles = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "thumbnail") {
            // Only images for thumbnail
            if (file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg") {
                cb(null, true);
            }
            else {
                cb(new Error("Thumbnail must be an image (PNG, JPG, JPEG)"));
            }
        }
        else if (file.fieldname === "media") {
            // Allow videos and other media types
            if (file.mimetype.startsWith("video/") ||
                file.mimetype.startsWith("audio/")) {
                cb(null, true);
            }
            else {
                cb(new Error("Media must be video or audio"));
            }
        }
        else {
            cb(new Error("Unexpected field"));
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 1024, // 1024MB (GB)
        files: 2,
    },
}).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "media", maxCount: 1 },
]);
// Add this function to your existing fileHandlers.ts
// Updated resume upload to use the applications directory
exports.uploadResume = (0, multer_1.default)({
    storage: resumeStorage,
    fileFilter: resumeFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
}).single("resume");
const getResumeUrl = (filename) => {
    return `/storage/applications/${filename}`;
};
exports.getResumeUrl = getResumeUrl;
const deleteResume = (filename) => {
    const filePath = path_1.default.join(__dirname, "../../public/storage/applications", filename);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
        return true;
    }
    return false;
};
exports.deleteResume = deleteResume;
