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
exports.SiteSettingsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const settings_service_1 = require("./settings.service");
const createOrUpdateSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { data } = req.body;
    // Parse JSON data if it's a string
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        }
        catch (error) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid JSON data");
        }
    }
    // Get existing settings to handle file deletion
    const existingSettings = yield settings_service_1.SiteSettingsService.getSiteSettings();
    // Handle file uploads
    if (req.files) {
        const files = req.files;
        // Process uploaded files
        files.forEach((file) => {
            if (file.fieldname === "logo") {
                // Delete old logo if exists
                if (existingSettings === null || existingSettings === void 0 ? void 0 : existingSettings.logo) {
                    const oldFilename = existingSettings.logo.split("/").pop();
                    (0, fileHandlers_1.deleteFile)(oldFilename !== null && oldFilename !== void 0 ? oldFilename : "");
                }
                data.logo = (0, fileHandlers_1.getFileUrl)(file.filename);
            }
            else if (file.fieldname === "favicon") {
                // Delete old favicon if exists
                if (existingSettings === null || existingSettings === void 0 ? void 0 : existingSettings.favicon) {
                    const oldFilename = existingSettings.favicon.split("/").pop();
                    (0, fileHandlers_1.deleteFile)(oldFilename !== null && oldFilename !== void 0 ? oldFilename : "");
                }
                data.favicon = (0, fileHandlers_1.getFileUrl)(file.filename);
            }
        });
    }
    const result = yield settings_service_1.SiteSettingsService.createOrUpdateSiteSettings(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Site settings updated successfully",
        data: result,
    });
}));
const getSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_service_1.SiteSettingsService.getSiteSettings();
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Site settings not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Site settings fetched successfully",
        data: result,
    });
}));
exports.SiteSettingsController = {
    createOrUpdateSettings,
    getSettings,
};
