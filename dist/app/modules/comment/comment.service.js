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
exports.CommentService = void 0;
const comment_model_1 = require("./comment.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createComment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.create(payload);
    return result;
});
// Get all comments for a specific news article with pagination
const getAllCommentByNews = (newsId, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const result = yield comment_model_1.Comment.find({ news: newsId })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);
    const total = yield comment_model_1.Comment.countDocuments({ news: newsId });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateComment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield comment_model_1.Comment.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Comment not found");
    }
    const updatedComment = yield comment_model_1.Comment.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedComment;
});
// Delete a comment by ID
const deleteComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.findByIdAndDelete(id);
    return result;
});
exports.CommentService = {
    createComment,
    getAllCommentByNews,
    updateComment,
    deleteComment,
};
