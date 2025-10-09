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
exports.PollService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const poll_model_1 = require("./poll.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const poll_constants_1 = require("./poll.constants");
const createPoll = (pollData) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield poll_model_1.Poll.findOne({
        title: pollData.title,
        question: pollData.question,
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Poll already exists with this title and question");
    }
    const createdPoll = yield poll_model_1.Poll.create(pollData);
    return createdPoll;
});
// Get all polls with filters, pagination, and sorting
const getAllPolls = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation (title or question)
    if (searchTerm) {
        andConditions.push({
            $or: poll_constants_1.pollSearchableFields.map((field) => ({
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
            return { [field]: value };
        });
        andConditions.push({ $and: filterConditions });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield poll_model_1.Poll.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield poll_model_1.Poll.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSinglePoll = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const poll = yield poll_model_1.Poll.findById(id);
    if (!poll) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Poll not found");
    }
    return poll;
});
const updatePoll = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield poll_model_1.Poll.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Poll not found");
    }
    const { title, question } = payload, otherData = __rest(payload, ["title", "question"]);
    // Check if updating title/question would cause a duplicate
    if (title || question) {
        const existingPoll = yield poll_model_1.Poll.findOne({
            title: title || isExist.title,
            question: question || isExist.question,
            _id: { $ne: id },
        });
        if (existingPoll) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Another poll already exists with this title and question");
        }
    }
    const updatedPoll = yield poll_model_1.Poll.findByIdAndUpdate(id, otherData, {
        new: true,
        runValidators: true,
    });
    return updatedPoll;
});
const deletePoll = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield poll_model_1.Poll.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Poll not found");
    }
    const deletedPoll = yield poll_model_1.Poll.findByIdAndDelete(id);
    return deletedPoll;
});
const voteForOption = (pollId, optionId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the poll by its ID
    const poll = yield poll_model_1.Poll.findById(pollId);
    if (!poll) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Poll not found");
    }
    // Find the option by its ID
    const option = poll.options.find((opt) => String(opt._id) === String(optionId));
    if (!option) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid option ID");
    }
    // Increment the vote count for the specified option
    option.votes += 1;
    yield poll.save(); // Save the updated poll
    return poll; // Return the updated poll
});
exports.PollService = {
    createPoll,
    getAllPolls,
    getSinglePoll,
    updatePoll,
    deletePoll,
    voteForOption,
};
