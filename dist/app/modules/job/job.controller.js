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
exports.JobController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const job_service_1 = require("./job.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const job_constants_1 = require("./job.constants");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const createJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let jobData = __rest(req.body, []);
    // Parse JSON fields if they come as strings
    if (typeof jobData.requirements === "string") {
        jobData.requirements = JSON.parse(jobData.requirements);
    }
    if (typeof jobData.education === "string") {
        jobData.education = JSON.parse(jobData.education);
    }
    if (typeof jobData.skills === "string") {
        jobData.skills = JSON.parse(jobData.skills);
    }
    // Check if job with same title already exists
    if (jobData.title) {
        const existingJob = yield job_service_1.JobService.getSingleJobByTitle(jobData.title);
        if (existingJob) {
            // Delete uploaded file if it exists
            if (req.file) {
                (0, fileHandlers_1.deleteFile)(req.file.filename);
            }
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Job with this title already exists");
        }
    }
    // Handle file upload
    if (req.file) {
        jobData.image = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield job_service_1.JobService.createJob(jobData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Job created successfully",
        data: result,
    });
}));
const getSingleJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield job_service_1.JobService.getSingleJob(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job fetched successfully",
        data: result,
    });
}));
const getAllJobs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, job_constants_1.jobFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield job_service_1.JobService.getAllJobs(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Jobs fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let updatedData = __rest(req.body, []);
    // Parse JSON fields if they come as strings
    if (typeof updatedData.requirements === "string") {
        updatedData.requirements = JSON.parse(updatedData.requirements);
    }
    if (typeof updatedData.education === "string") {
        updatedData.education = JSON.parse(updatedData.education);
    }
    if (typeof updatedData.skills === "string") {
        updatedData.skills = JSON.parse(updatedData.skills);
    }
    const existingJob = yield job_service_1.JobService.getSingleJob(id);
    if (!existingJob) {
        // Delete uploaded file if it exists
        if (req.file) {
            (0, fileHandlers_1.deleteFile)(req.file.filename);
        }
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job not found");
    }
    // Check if title is being updated and if it already exists
    if (updatedData.title && updatedData.title !== existingJob.title) {
        const jobWithSameTitle = yield job_service_1.JobService.getSingleJobByTitle(updatedData.title);
        if (jobWithSameTitle) {
            // Delete uploaded file if it exists
            if (req.file) {
                (0, fileHandlers_1.deleteFile)(req.file.filename);
            }
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Job with this title already exists");
        }
    }
    // Handle file upload
    if (req.file) {
        // Delete old image if it exists
        if (existingJob.image) {
            const filename = existingJob.image.split("/").pop();
            if (filename) {
                (0, fileHandlers_1.deleteFile)(filename);
            }
        }
        updatedData.image = (0, fileHandlers_1.getFileUrl)(req.file.filename);
    }
    const result = yield job_service_1.JobService.updateJob(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job updated successfully",
        data: result,
    });
}));
const deleteJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const existingJob = yield job_service_1.JobService.getSingleJob(id);
    if (!existingJob) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job not found");
    }
    // Delete associated image file if it exists
    if (existingJob.image) {
        const filename = existingJob.image.split("/").pop();
        if (filename) {
            (0, fileHandlers_1.deleteFile)(filename);
        }
    }
    const result = yield job_service_1.JobService.deleteJob(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job deleted successfully",
        data: result,
    });
}));
exports.JobController = {
    createJob,
    getSingleJob,
    getAllJobs,
    updateJob,
    deleteJob,
};
