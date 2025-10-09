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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpaperController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const EPaper_service_1 = require("./EPaper.service");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const mongoose_1 = require("mongoose");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createEpaper = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let data = __rest(req.body, []);
    // Parse JSON if needed
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    // Validate ObjectId fields
    const objectIdFields = ["category"];
    for (const field of objectIdFields) {
        if (data[field] && !mongoose_1.Types.ObjectId.isValid(data[field])) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid ${field} ID`);
        }
    }
    // Extract uploaded files
    const files = req.files;
    const mainFile = (_a = files["file"]) === null || _a === void 0 ? void 0 : _a[0];
    const thumbnailFile = (_b = files["thumbnail"]) === null || _b === void 0 ? void 0 : _b[0];
    // Validate required fields
    if (!data.title) {
        // Clean up files if title is missing
        if (mainFile)
            (0, fileHandlers_1.deleteFile)(mainFile.filename);
        if (thumbnailFile)
            (0, fileHandlers_1.deleteFile)(thumbnailFile.filename);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Title is required");
    }
    if (!mainFile) {
        // Clean up thumbnail if main file is missing
        if (thumbnailFile)
            (0, fileHandlers_1.deleteFile)(thumbnailFile.filename);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Main file is required");
    }
    // Check for duplicate title
    const existingEpaper = yield EPaper_service_1.EpaperService.getEpaperByTitle(data.title);
    if (existingEpaper) {
        // Clean up files if duplicate exists
        if (mainFile)
            (0, fileHandlers_1.deleteFile)(mainFile.filename);
        if (thumbnailFile)
            (0, fileHandlers_1.deleteFile)(thumbnailFile.filename);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Epaper with this title already exists");
    }
    // Prepare Epaper data
    const epaperData = {
        title: data.title,
        date: data.date ? new Date(data.date) : new Date(),
        file: mainFile ? (0, fileHandlers_1.getFileUrl)(mainFile.filename) : "",
        thumbnail: thumbnailFile ? (0, fileHandlers_1.getFileUrl)(thumbnailFile.filename) : "",
        edition: data.edition,
        category: data.category,
        isActive: data.isActive !== "false",
    };
    // Create Epaper in database
    const result = yield EPaper_service_1.EpaperService.createEpaper(epaperData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ePaper created successfully!",
        data: result,
    });
}));
// Get all ePapers
const getAllEpapers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.query;
    const paginationOptions = req.query;
    const result = yield EPaper_service_1.EpaperService.getAllEpapers(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ePapers fetched successfully!",
        meta: result.meta,
        data: result.data,
    });
}));
// Get single ePaper
const getSingleEpaper = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield EPaper_service_1.EpaperService.getSingleEpaper(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ePaper fetched successfully!",
        data: result,
    });
}));
// Update ePaper
const updateEpaper = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const validatedData = req.body;
    const result = yield EPaper_service_1.EpaperService.updateEpaper(id, validatedData.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ePaper updated successfully!",
        data: result,
    });
}));
// Delete ePaper
const deleteEpaper = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield EPaper_service_1.EpaperService.deleteEpaper(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ePaper deleted successfully!",
        data: result,
    });
}));
exports.EpaperController = {
    createEpaper,
    getAllEpapers,
    getSingleEpaper,
    updateEpaper,
    deleteEpaper,
};
