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
exports.DonationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const donation_service_1 = require("./donation.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const donation_model_1 = require("./donation.model");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const donation_constants_1 = require("./donation.constants");
const createDonation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const donationData = __rest(req.body, []);
    // Check for existing title
    const existingDonation = yield donation_model_1.DonationPost.findOne({
        title: donationData.title,
    });
    if (existingDonation) {
        if (req.file)
            (0, fileHandlers_1.deleteFile)(req.file.filename);
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Donation with this title already exists");
    }
    // Handle file upload
    if (req.file) {
        donationData.featuredImage = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield donation_service_1.DonationService.createDonation(donationData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation post created successfully",
        data: result,
    });
}));
const getSingleDonation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield donation_service_1.DonationService.getSingleDonation(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation post fetched successfully",
        data: result,
    });
}));
const getDonationBySlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield donation_service_1.DonationService.getDonationBySlug(slug);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Donation post not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation post fetched successfully",
        data: result,
    });
}));
const getAllDonations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, donation_constants_1.donationFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield donation_service_1.DonationService.getAllDonations(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donations fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateDonation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = __rest(req.body, []);
    const existingDonation = yield donation_model_1.DonationPost.findById(id);
    if (!existingDonation) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Donation post not found");
    }
    // Handle file upload
    if (req.file) {
        if (existingDonation.featuredImage) {
            const oldFilename = existingDonation.featuredImage.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFilename !== null && oldFilename !== void 0 ? oldFilename : "");
        }
        updateData.featuredImage = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield donation_service_1.DonationService.updateDonation(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation post updated successfully",
        data: result,
    });
}));
const deleteDonation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const donation = yield donation_service_1.DonationService.getSingleDonation(id);
    if (!donation) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Donation post not found");
    }
    if (donation.featuredImage) {
        const filename = donation.featuredImage.split("/").pop();
        (0, fileHandlers_1.deleteFile)(filename !== null && filename !== void 0 ? filename : "");
    }
    const result = yield donation_service_1.DonationService.deleteDonation(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation post deleted successfully",
        data: result,
    });
}));
const addDonationTransaction = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const transactionData = req.body;
    const result = yield donation_service_1.DonationService.addDonationTransaction(id, transactionData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Donation transaction added successfully",
        data: result,
    });
}));
const handlePaymentCallback = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { donationId, transactionId } = req.params;
    const { status } = req.body;
    if (!["success", "failed"].includes(status)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid status value");
    }
    const result = yield donation_service_1.DonationService.updateTransactionStatus(donationId, transactionId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Donation status updated to ${status}`,
        data: result,
    });
}));
exports.DonationController = {
    createDonation,
    getSingleDonation,
    getDonationBySlug,
    getAllDonations,
    updateDonation,
    deleteDonation,
    addDonationTransaction,
    handlePaymentCallback,
};
