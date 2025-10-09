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
exports.NewsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const news_service_1 = require("./news.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const news_contants_1 = require("./news.contants");
const mongoose_1 = require("mongoose");
const createNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = __rest(req.body, []);
    if (typeof data === "string") {
        data = JSON.parse(data);
    }
    const objectIdFields = ["category"];
    for (const field of objectIdFields) {
        if (data[field] && !mongoose_1.Types.ObjectId.isValid(data[field])) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid ${field} ID`);
        }
    }
    if (data.title) {
        const existingNews = yield news_service_1.NewsService.getSingleNewsByTitle(data.title);
        if (existingNews) {
            if (req.files) {
                req.files.forEach((file) => (0, fileHandlers_1.deleteFile)(file.filename));
            }
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "News article already exists");
        }
    }
    // Handle file uploads
    if (req.files) {
        data.media = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename));
    }
    const result = yield news_service_1.NewsService.createNews(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "News article created successfully",
        data: result,
    });
}));
const getSingleNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield news_service_1.NewsService.getSingleNews(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "News article not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "News article fetched successfully",
        data: result,
    });
}));
const getNewsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const news = yield (0, news_service_1.getNewsByCategorySlug)(slug);
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
});
const getAllNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, news_contants_1.newsFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield news_service_1.NewsService.getAllNews(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "News articles fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let updatedData = __rest(req.body, []);
    // Parse updated data if it's a string
    if (typeof updatedData === "string") {
        updatedData = JSON.parse(updatedData);
    }
    // Fetch existing news article
    const existingNews = yield news_service_1.NewsService.getSingleNews(id);
    if (!existingNews) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "News article not found");
    }
    // Validate ObjectId fields for category
    if (updatedData.category && !mongoose_1.Types.ObjectId.isValid(updatedData.category)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid category ID");
    }
    // Handle media files update
    if (Array.isArray(req.files) && req.files.length > 0) {
        // Delete existing media files
        if (existingNews.media && existingNews.media.length > 0) {
            yield Promise.all(existingNews.media.map((mediaUrl) => __awaiter(void 0, void 0, void 0, function* () {
                const filename = mediaUrl.split("/").pop();
                if (filename) {
                    yield (0, fileHandlers_1.deleteFile)(filename); // Ensure you wait for file deletion
                }
            })));
        }
        // Add new media files to updatedData
        updatedData.media = req.files.map((file) => (0, fileHandlers_1.getFileUrl)(file.filename) // Assuming getFileUrl is defined to return the file URL
        );
    }
    // Update the news article in the database
    const updatedNews = yield news_service_1.NewsService.updateNews(id, updatedData);
    // Send the response back
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "News updated successfully",
        data: updatedNews,
    });
}));
const deleteNews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const existingNews = yield news_service_1.NewsService.getSingleNews(id);
    if (!existingNews) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "News article not found");
    }
    // Delete associated media files if any
    if (existingNews.media.length > 0) {
        const filename = existingNews.media[0].split("/").pop();
        (0, fileHandlers_1.deleteFile)(filename !== null && filename !== void 0 ? filename : "");
    }
    const result = yield news_service_1.NewsService.deleteNews(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "News article deleted successfully",
        data: result,
    });
}));
exports.NewsController = {
    createNews,
    getSingleNews,
    getNewsByCategory,
    getAllNews,
    updateNews,
    deleteNews,
};
