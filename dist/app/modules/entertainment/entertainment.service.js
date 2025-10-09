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
exports.EntertainmentService = void 0;
const entertainment_model_1 = require("./entertainment.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const entertainment_constants_1 = require("./entertainment.constants");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createEntertainment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield entertainment_model_1.Entertainment.create(payload);
    return result;
});
const getSingleEntertainment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield entertainment_model_1.Entertainment.findById(id).populate("category");
    return result;
});
const getAllEntertainments = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: entertainment_constants_1.entertainmentSearchableFields.map((field) => ({
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
            $and: Object.entries(filtersData).map(([field, value]) => {
                if (field === "category") {
                    return {
                        [field]: mongoose_1.Types.ObjectId.isValid(value)
                            ? new mongoose_1.Types.ObjectId(value)
                            : value,
                    };
                }
                return { [field]: value };
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield entertainment_model_1.Entertainment.find(whereConditions)
        .populate("category")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield entertainment_model_1.Entertainment.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateEntertainment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEntertainment = yield entertainment_model_1.Entertainment.findById(id);
    if (!existingEntertainment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Entertainment not found");
    }
    const result = yield entertainment_model_1.Entertainment.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteEntertainment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield entertainment_model_1.Entertainment.findByIdAndDelete(id);
    return result;
});
exports.EntertainmentService = {
    createEntertainment,
    getSingleEntertainment,
    getAllEntertainments,
    updateEntertainment,
    deleteEntertainment,
};
