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
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const category_constants_1 = require("./category.constants");
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.create(payload);
    return result;
});
const getSingleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findById(id);
    return result;
});
const getAllCategories = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: category_constants_1.categorySearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters implementation
    if (Object.keys(filtersData).length) {
        const filterConditions = Object.entries(filtersData).map(([field, value]) => {
            if (field === "parentCategory") {
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
    const result = yield category_model_1.Category.find(whereConditions)
        .populate("parentCategory")
        .populate("children")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield category_model_1.Category.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.Category.findByIdAndDelete(id);
    return result;
});
exports.CategoryService = {
    createCategory,
    getSingleCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
