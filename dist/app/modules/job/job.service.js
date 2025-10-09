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
exports.JobService = void 0;
const job_model_1 = require("./job.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const job_constants_1 = require("./job.constants");
const createJob = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.create(payload);
    return result;
});
const getSingleJob = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.findById(id);
    return result;
});
const getSingleJobByTitle = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.findOne({ title });
    return result;
});
const getAllJobs = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: job_constants_1.jobSearchableFields.map((field) => ({
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
            // Handle boolean values
            if (field === "isActive") {
                return { [field]: value === "true" || value === true };
            }
            return { [field]: value };
        });
        andConditions.push({ $and: filterConditions });
    }
    // Only show active jobs by default
    if (!filtersData.hasOwnProperty("isActive")) {
        andConditions.push({ isActive: true });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : { isActive: true };
    const result = yield job_model_1.Job.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield job_model_1.Job.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateJob = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteJob = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.Job.findByIdAndDelete(id);
    return result;
});
exports.JobService = {
    createJob,
    getSingleJob,
    getSingleJobByTitle,
    getAllJobs,
    updateJob,
    deleteJob,
};
