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
exports.EntertainmentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const entertainment_service_1 = require("./entertainment.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const entertainment_constants_1 = require("./entertainment.constants");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createEntertainment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const payload = req.body;
    if (!files.thumbnail || files.thumbnail.length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Thumbnail is required");
    }
    // Handle thumbnail
    payload.thumbnail = (0, fileHandlers_1.getFileUrl)(files.thumbnail[0].filename);
    // Handle media if exists
    if (files.media && files.media.length > 0) {
        payload.media = (0, fileHandlers_1.getFileUrl)(files.media[0].filename);
    }
    const result = yield entertainment_service_1.EntertainmentService.createEntertainment(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Entertainment created successfully",
        data: result,
    });
}));
const getSingleEntertainment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield entertainment_service_1.EntertainmentService.getSingleEntertainment(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Entertainment fetched successfully",
        data: result,
    });
}));
const getAllEntertainments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, entertainment_constants_1.entertainmentFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield entertainment_service_1.EntertainmentService.getAllEntertainments(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Entertainments fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateEntertainment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const files = req.files;
    const payload = req.body;
    const existingEntertainment = yield entertainment_service_1.EntertainmentService.getSingleEntertainment(id);
    if (!existingEntertainment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Entertainment not found");
    }
    // Handle thumbnail update
    if (files.thumbnail && files.thumbnail.length > 0) {
        // Delete old thumbnail
        if (existingEntertainment.thumbnail) {
            const oldFilename = existingEntertainment.thumbnail.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFilename || "");
        }
        payload.thumbnail = (0, fileHandlers_1.getFileUrl)(files.thumbnail[0].filename);
    }
    // Handle media update
    if (files.media && files.media.length > 0) {
        // Delete old media
        if (existingEntertainment.media) {
            const oldFilename = existingEntertainment.media.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFilename || "");
        }
        payload.media = (0, fileHandlers_1.getFileUrl)(files.media[0].filename);
    }
    const result = yield entertainment_service_1.EntertainmentService.updateEntertainment(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Entertainment updated successfully",
        data: result,
    });
}));
const deleteEntertainment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const entertainment = yield entertainment_service_1.EntertainmentService.getSingleEntertainment(id);
    if (!entertainment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Entertainment not found");
    }
    // Delete associated files
    if (entertainment.thumbnail) {
        const thumbnail = entertainment.thumbnail.split("/").pop();
        (0, fileHandlers_1.deleteFile)(thumbnail || "");
    }
    if (entertainment.media) {
        const media = entertainment.media.split("/").pop();
        (0, fileHandlers_1.deleteFile)(media || "");
    }
    const result = yield entertainment_service_1.EntertainmentService.deleteEntertainment(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Entertainment deleted successfully",
        data: result,
    });
}));
exports.EntertainmentController = {
    createEntertainment,
    getSingleEntertainment,
    getAllEntertainments,
    updateEntertainment,
    deleteEntertainment,
};
