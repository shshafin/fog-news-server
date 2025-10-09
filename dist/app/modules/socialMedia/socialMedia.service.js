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
exports.SocialMediaService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const socialMedia_model_1 = require("./socialMedia.model");
const createSocialMedia = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if platform already exists
    // const existingPlatform = await SocialMedia.findOne({
    //   videoId: payload.videoId,
    // });
    // if (existingPlatform) {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     `${payload.videoId} already exists`
    //   );
    // }
    const result = yield socialMedia_model_1.SocialMedia.create(payload);
    return result;
});
const getAllSocialMedia = () => __awaiter(void 0, void 0, void 0, function* () {
    return socialMedia_model_1.SocialMedia.find({ isActive: true }).sort({ order: 1 });
});
const getSingleSocialMedia = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield socialMedia_model_1.SocialMedia.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Social media not found");
    }
    return result;
});
const updateSocialMedia = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield socialMedia_model_1.SocialMedia.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Social media not found");
    }
    // Prevent platform change
    if (payload.videoId && payload.videoId !== isExist.videoId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot change platform type");
    }
    const result = yield socialMedia_model_1.SocialMedia.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteSocialMedia = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield socialMedia_model_1.SocialMedia.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Social media not found");
    }
    return result;
});
const toggleActiveStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const socialMedia = yield socialMedia_model_1.SocialMedia.findById(id);
    if (!socialMedia) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Social media not found");
    }
    yield socialMedia.save();
    return socialMedia;
});
exports.SocialMediaService = {
    createSocialMedia,
    getAllSocialMedia,
    getSingleSocialMedia,
    updateSocialMedia,
    deleteSocialMedia,
    toggleActiveStatus,
};
