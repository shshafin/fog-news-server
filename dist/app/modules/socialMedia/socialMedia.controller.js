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
exports.SocialMediaController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const socialMedia_service_1 = require("./socialMedia.service");
const createSocialMedia = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // Call the service to create social media
    const result = yield socialMedia_service_1.SocialMediaService.createSocialMedia(payload);
    // Send the response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Multimedia created successfully",
        data: result,
    });
}));
const getAllSocialMedia = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield socialMedia_service_1.SocialMediaService.getAllSocialMedia();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social media links retrieved successfully",
        data: result,
    });
}));
const getSingleSocialMedia = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield socialMedia_service_1.SocialMediaService.getSingleSocialMedia(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social media retrieved successfully",
        data: result,
    });
}));
const updateSocialMedia = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const result = yield socialMedia_service_1.SocialMediaService.updateSocialMedia(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social media updated successfully",
        data: result,
    });
}));
const deleteSocialMedia = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield socialMedia_service_1.SocialMediaService.deleteSocialMedia(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Social media deleted successfully",
        data: result,
    });
}));
exports.SocialMediaController = {
    createSocialMedia,
    getAllSocialMedia,
    getSingleSocialMedia,
    updateSocialMedia,
    deleteSocialMedia,
};
