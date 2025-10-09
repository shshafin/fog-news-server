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
exports.DonationService = void 0;
const donation_model_1 = require("./donation.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const donation_constants_1 = require("./donation.constants");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createDonation = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if donation with same title exists
    const existingDonation = yield donation_model_1.DonationPost.findOne({ title: payload.title });
    if (existingDonation) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Donation post with this title already exists");
    }
    const result = yield donation_model_1.DonationPost.create(payload);
    return result;
});
const getSingleDonation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donation_model_1.DonationPost.findById(id).populate("category");
    return result;
});
const getDonationBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donation_model_1.DonationPost.findOne({ slug }).populate("category");
    return result;
});
const getAllDonations = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, minAmount, maxAmount } = filters, filtersData = __rest(filters, ["searchTerm", "minAmount", "maxAmount"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: donation_constants_1.donationSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Amount range filtering
    if (minAmount !== undefined || maxAmount !== undefined) {
        const amountFilter = {};
        if (minAmount !== undefined)
            amountFilter.$gte = minAmount;
        if (maxAmount !== undefined)
            amountFilter.$lte = maxAmount;
        andConditions.push({
            collectedAmount: amountFilter,
        });
    }
    // Filters implementation
    if (Object.keys(filtersData).length) {
        const filterConditions = Object.entries(filtersData).map(([field, value]) => {
            if (field === "category") {
                return {
                    [field]: typeof value === "string" && mongoose_1.Types.ObjectId.isValid(value)
                        ? new mongoose_1.Types.ObjectId(value)
                        : value,
                };
            }
            return { [field]: value };
        });
        andConditions.push({ $and: filterConditions });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield donation_model_1.DonationPost.find(whereConditions)
        .populate("category")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield donation_model_1.DonationPost.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateDonation = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donation_model_1.DonationPost.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("category");
    return result;
});
const deleteDonation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donation_model_1.DonationPost.findByIdAndDelete(id);
    return result;
});
const addDonationTransaction = (id, transactionData) => __awaiter(void 0, void 0, void 0, function* () {
    const donation = yield donation_model_1.DonationPost.findById(id);
    if (!donation) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Donation post not found");
    }
    // Add transaction to donations array
    const updatedDonation = yield donation_model_1.DonationPost.findByIdAndUpdate(id, {
        $push: {
            donations: Object.assign(Object.assign({}, transactionData), { status: "pending", date: new Date() }),
        },
    }, { new: true }).populate("category");
    return updatedDonation;
});
const updateTransactionStatus = (donationId, transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const donation = yield donation_model_1.DonationPost.findOne({
        _id: donationId,
        "donations.transactionId": transactionId,
    });
    if (!donation) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Transaction not found");
    }
    // Find the index of the transaction
    const transactionIndex = donation.donations.findIndex((t) => t.transactionId === transactionId);
    if (transactionIndex === -1) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Transaction not found");
    }
    // Update the transaction status
    donation.donations[transactionIndex].status = status;
    // Recalculate collected amount
    donation.collectedAmount = donation.donations
        .filter((d) => d.status === "success")
        .reduce((sum, donation) => sum + donation.amount, 0);
    const updatedDonation = yield donation.save();
    return updatedDonation;
});
exports.DonationService = {
    createDonation,
    getSingleDonation,
    getDonationBySlug,
    getAllDonations,
    updateDonation,
    deleteDonation,
    addDonationTransaction,
    updateTransactionStatus,
};
