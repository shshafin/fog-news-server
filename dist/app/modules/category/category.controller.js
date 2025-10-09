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
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const category_service_1 = require("./category.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const category_model_1 = require("./category.model");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryData = __rest(req.body, []);
    const existingCategory = yield category_model_1.Category.findOne({ name: categoryData.name });
    if (existingCategory) {
        if (req.file) {
            (0, fileHandlers_1.deleteFile)(req.file.filename);
        }
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Category already exists");
    }
    if (req.file) {
        categoryData.image = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield category_service_1.CategoryService.createCategory(categoryData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category created successfully",
        data: result,
    });
}));
const getSingleCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield category_service_1.CategoryService.getSingleCategory(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category fetched successfully",
        data: result,
    });
}));
const getAllCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ["searchTerm"]);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield category_service_1.CategoryService.getAllCategories(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Categories fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const categoryData = __rest(req.body, []);
    const existingCategory = yield category_model_1.Category.findById(id);
    if (!existingCategory) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Category not found");
    }
    if (req.file) {
        if (existingCategory.image) {
            const oldFilename = existingCategory.image.split("/").pop();
            (0, fileHandlers_1.deleteFile)(oldFilename !== null && oldFilename !== void 0 ? oldFilename : "");
        }
        categoryData.image = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield category_service_1.CategoryService.updateCategory(id, categoryData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
}));
const deleteCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_service_1.CategoryService.getSingleCategory(id);
    if (!category) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Make not found");
    }
    if (category.image) {
        const filename = category.image.split("/").pop();
        (0, fileHandlers_1.deleteFile)(filename !== null && filename !== void 0 ? filename : "");
    }
    const result = yield category_service_1.CategoryService.deleteCategory(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
}));
exports.CategoryController = {
    createCategory,
    getSingleCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
