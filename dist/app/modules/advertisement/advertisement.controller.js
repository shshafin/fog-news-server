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
exports.AdvertisementController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const advertisement_service_1 = require("./advertisement.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const advertisement_constants_1 = require("./advertisement.constants");
const createAdvertisement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, imageUrl, targetUrl, target, type, status, startDate, endDate, priority, } = req.body;
    // Handle file upload if provided
    let imageUrlFinal = imageUrl;
    if (req.file) {
        imageUrlFinal = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const advertisementData = {
        title,
        description,
        imageUrl: imageUrlFinal,
        targetUrl,
        target,
        type,
        status,
        startDate,
        endDate,
        priority,
    };
    const result = yield advertisement_service_1.AdvertisementService.createAdvertisement(advertisementData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Advertisement created successfully",
        data: result,
    });
}));
const getSingleAdvertisement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield advertisement_service_1.AdvertisementService.getSingleAdvertisement(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Advertisement not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Advertisement fetched successfully",
        data: result,
    });
}));
const getAllAdvertisements = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, advertisement_constants_1.advertisementFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield advertisement_service_1.AdvertisementService.getAllAdvertisements(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Advertisements fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getActiveAdvertisements = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield advertisement_service_1.AdvertisementService.getActiveAdvertisements();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active advertisements fetched successfully",
        data: result,
    });
}));
const updateAdvertisement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const existingAdvertisement = yield advertisement_service_1.AdvertisementService.getSingleAdvertisement(id);
    if (!existingAdvertisement) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Advertisement not found");
    }
    // Handle file update if provided
    if (req.file) {
        if (existingAdvertisement.imageUrl) {
            const oldFile = existingAdvertisement.imageUrl.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFile !== null && oldFile !== void 0 ? oldFile : "");
        }
        payload.imageUrl = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield advertisement_service_1.AdvertisementService.updateAdvertisement(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Advertisement updated successfully",
        data: result,
    });
}));
const deleteAdvertisement = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const existingAdvertisement = yield advertisement_service_1.AdvertisementService.getSingleAdvertisement(id);
    if (!existingAdvertisement) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Advertisement not found");
    }
    // Delete associated image file if any
    if (existingAdvertisement.imageUrl) {
        const filename = existingAdvertisement.imageUrl.split("/").pop();
        (0, fileHandlers_1.deleteFile)(filename !== null && filename !== void 0 ? filename : "");
    }
    const result = yield advertisement_service_1.AdvertisementService.deleteAdvertisement(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Advertisement deleted successfully",
        data: result,
    });
}));
const toggleAdvertisementStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield advertisement_service_1.AdvertisementService.toggleAdvertisementStatus(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Advertisement status toggled successfully",
        data: result,
    });
}));
const countActiveAdvertisements = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield advertisement_service_1.AdvertisementService.countActiveAdvertisements();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Active advertisements count retrieved successfully",
        data: { count },
    });
}));
const getExpiredAdvertisements = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield advertisement_service_1.AdvertisementService.getExpiredAdvertisements();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Expired advertisements retrieved successfully",
        data: result,
    });
}));
exports.AdvertisementController = {
    createAdvertisement,
    getSingleAdvertisement,
    getAllAdvertisements,
    getActiveAdvertisements,
    updateAdvertisement,
    deleteAdvertisement,
    toggleAdvertisementStatus,
    countActiveAdvertisements,
    getExpiredAdvertisements,
};
