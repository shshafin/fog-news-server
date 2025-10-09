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
exports.NewsService = exports.getNewsByCategorySlug = void 0;
const news_model_1 = require("./news.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const news_contants_1 = require("./news.contants");
const category_model_1 = require("../category/category.model");
const createNews = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.News.create(payload);
    return result;
});
const getSingleNews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.News.findById(id).populate("category");
    return result;
});
const getNewsByCategorySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findOne({ slug });
    if (!category)
        return [];
    const news = yield news_model_1.News.find({ category: category._id }).populate('category');
    return news;
});
exports.getNewsByCategorySlug = getNewsByCategorySlug;
const getSingleNewsByTitle = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.News.findOne({ title }).populate("category");
    return result;
});
const getAllNews = (filters, // Use appropriate filters, e.g., status, type, etc.
paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: news_contants_1.newsSearchableFields.map((field) => ({
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
    const result = yield news_model_1.News.find(whereConditions)
        .populate("category")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield news_model_1.News.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateNews = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.News.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteNews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield news_model_1.News.findByIdAndDelete(id);
    return result;
});
exports.NewsService = {
    createNews,
    getSingleNews,
    getSingleNewsByTitle,
    getAllNews,
    updateNews,
    deleteNews,
};
