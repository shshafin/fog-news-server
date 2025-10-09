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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisementService = void 0;
const advertisement_model_1 = require("./advertisement.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const advertisement_constants_1 = require("./advertisement.constants");
const createAdvertisement = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield advertisement_model_1.Advertisement.create(payload);
    return result;
});
const getSingleAdvertisement = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield advertisement_model_1.Advertisement.findById(id);
    return result;
});
const getAllAdvertisements = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: advertisement_constants_1.advertisementSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters implementation
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield advertisement_model_1.Advertisement.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield advertisement_model_1.Advertisement.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getActiveAdvertisements = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    return advertisement_model_1.Advertisement.find({
        status: "active",
        startDate: { $lte: now },
        endDate: { $gte: now },
    }).sort({ priority: -1 });
});
const updateAdvertisement = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield advertisement_model_1.Advertisement.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteAdvertisement = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield advertisement_model_1.Advertisement.findByIdAndDelete(id);
    return result;
});
const toggleAdvertisementStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const advertisement = yield advertisement_model_1.Advertisement.findById(id);
    if (!advertisement) {
        return null;
    }
    advertisement.status =
        advertisement.status === "active" ? "inactive" : "active";
    return advertisement.save();
});
const countActiveAdvertisements = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    return advertisement_model_1.Advertisement.countDocuments({
        status: "active",
        startDate: { $lte: now },
        endDate: { $gte: now },
    });
});
const getExpiredAdvertisements = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    return advertisement_model_1.Advertisement.find({
        endDate: { $lt: now },
        status: { $ne: "expired" },
    });
});
// Then add these to your exported service
exports.AdvertisementService = {
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
