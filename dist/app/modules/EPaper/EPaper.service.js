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
exports.EpaperService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const EPaper_model_1 = require("./EPaper.model");
// Create ePaper
const createEpaper = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield EPaper_model_1.Epaper.create(payload);
    return result;
});
// Get all ePapers (with pagination)
const getAllEpapers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search by title or edition
    if (searchTerm) {
        andConditions.push({
            $or: ["title", "edition"].map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        });
    }
    // Filtering
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const result = yield EPaper_model_1.Epaper.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield EPaper_model_1.Epaper.countDocuments(whereConditions);
    return {
        meta: { page, limit, total },
        data: result,
    };
});
// Get single ePaper
const getSingleEpaper = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield EPaper_model_1.Epaper.findById(id);
});
const getEpaperByTitle = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield EPaper_model_1.Epaper.findOne({ title });
    return result;
});
// Update ePaper
const updateEpaper = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield EPaper_model_1.Epaper.findByIdAndUpdate(id, payload, { new: true });
});
// Delete ePaper (soft delete)
const deleteEpaper = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield EPaper_model_1.Epaper.findByIdAndDelete(id);
});
exports.EpaperService = {
    createEpaper,
    getAllEpapers,
    getSingleEpaper,
    getEpaperByTitle,
    updateEpaper,
    deleteEpaper,
};
