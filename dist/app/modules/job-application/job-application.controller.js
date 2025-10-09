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
exports.JobApplicationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const job_application_service_1 = require("./job-application.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const job_application_constants_1 = require("./job-application.constants");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const path_1 = __importDefault(require("path"));
const createJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationData = __rest(req.body, []);
    if (typeof applicationData.jobPost === "string") {
        applicationData.jobPost = applicationData.jobPost;
    }
    if (!req.file) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Resume file is required");
    }
    // Extract just the filename and create the proper relative path
    const filename = path_1.default.basename(req.file.path);
    applicationData.resumePath = `/storage/applications/${filename}`;
    const result = yield job_application_service_1.JobApplicationService.createJobApplication(applicationData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Job application submitted successfully. Email notification has been sent.",
        data: result,
    });
}));
// Add a controller for retrying failed emails (for admin use)
const retryFailedEmails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield job_application_service_1.JobApplicationService.retryFailedEmails();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Email retry process completed",
    });
}));
const getSingleJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield job_application_service_1.JobApplicationService.getSingleJobApplication(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job application not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job application fetched successfully",
        data: result,
    });
}));
const getApplicationsByJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield job_application_service_1.JobApplicationService.getApplicationsByJob(jobId, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job applications fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getApplicationsByEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield job_application_service_1.JobApplicationService.getApplicationsByEmail(email, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job applications fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getAllJobApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, job_application_constants_1.jobApplicationFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield job_application_service_1.JobApplicationService.getAllJobApplications(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job applications fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedData = __rest(req.body, []);
    const existingApplication = yield job_application_service_1.JobApplicationService.getSingleJobApplication(id);
    if (!existingApplication) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job application not found");
    }
    const result = yield job_application_service_1.JobApplicationService.updateJobApplication(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job application updated successfully",
        data: result,
    });
}));
const updateApplicationStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const existingApplication = yield job_application_service_1.JobApplicationService.getSingleJobApplication(id);
    if (!existingApplication) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job application not found");
    }
    const result = yield job_application_service_1.JobApplicationService.updateApplicationStatus(id, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Application status updated successfully",
        data: result,
    });
}));
const deleteJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const existingApplication = yield job_application_service_1.JobApplicationService.getSingleJobApplication(id);
    if (!existingApplication) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Job application not found");
    }
    // Delete associated resume file
    if (existingApplication.resumePath) {
        const filename = existingApplication.resumePath.split("/").pop();
        if (filename) {
            (0, fileHandlers_1.deleteResume)(filename);
        }
    }
    const result = yield job_application_service_1.JobApplicationService.deleteJobApplication(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Job application deleted successfully",
        data: result,
    });
}));
exports.JobApplicationController = {
    createJobApplication,
    retryFailedEmails,
    getSingleJobApplication,
    getApplicationsByJob,
    getApplicationsByEmail,
    getAllJobApplications,
    updateJobApplication,
    updateApplicationStatus,
    deleteJobApplication,
};
