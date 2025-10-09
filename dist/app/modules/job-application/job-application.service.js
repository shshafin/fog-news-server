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
exports.JobApplicationService = void 0;
const job_application_model_1 = require("./job-application.model");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const mongoose_1 = require("mongoose");
const job_application_constants_1 = require("./job-application.constants");
const job_model_1 = require("../job/job.model");
const email_service_1 = require("../../../shared/email.service");
const path_1 = __importDefault(require("path"));
const createJobApplication = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // First, get the job post details to get the contact email
    const jobPost = yield job_model_1.Job.findById(payload.jobPost);
    if (!jobPost) {
        throw new Error("Job post not found");
    }
    // Create the application - use the resumePath as provided by controller
    const result = yield job_application_model_1.JobApplication.create(payload);
    // Send email with the application details and resume
    try {
        // Convert the relative path to absolute path for email attachment
        const absolutePath = path_1.default.join(process.cwd(), "public", payload.resumePath.startsWith("/")
            ? payload.resumePath.substring(1)
            : payload.resumePath);
        const emailSent = yield (0, email_service_1.sendJobApplicationEmail)(jobPost, payload, absolutePath // Pass the absolute path to the email function
        );
        // Update email status based on the result
        if (emailSent) {
            yield job_application_model_1.JobApplication.findByIdAndUpdate(result._id, {
                emailStatus: "sent",
                emailSentAt: new Date(),
            });
        }
        else {
            yield job_application_model_1.JobApplication.findByIdAndUpdate(result._id, {
                emailStatus: "failed",
                emailRetries: 1,
                lastEmailError: "Failed to send email",
            });
        }
    }
    catch (error) {
        console.error("Error sending email:", error);
        yield job_application_model_1.JobApplication.findByIdAndUpdate(result._id, {
            emailStatus: "failed",
            emailRetries: 1,
            lastEmailError: error instanceof Error ? error.message : String(error),
        });
    }
    return result;
});
// Add email retry function
const retryFailedEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const failedApplications = yield job_application_model_1.JobApplication.find({
        emailStatus: "failed",
        emailRetries: { $lt: 3 }, // Limit retries to 3 times
    }).populate("jobPost");
    for (const application of failedApplications) {
        try {
            const emailSent = yield (0, email_service_1.sendJobApplicationEmail)(application.jobPost, application, application.resumePath);
            if (emailSent) {
                yield job_application_model_1.JobApplication.findByIdAndUpdate(application._id, {
                    emailStatus: "sent",
                    emailSentAt: new Date(),
                    emailRetries: ((_a = application.emailRetries) !== null && _a !== void 0 ? _a : 0) + 1, // Use nullish coalescing to default to 0
                });
            }
            else {
                yield job_application_model_1.JobApplication.findByIdAndUpdate(application._id, {
                    emailStatus: "failed",
                    emailRetries: ((_b = application.emailRetries) !== null && _b !== void 0 ? _b : 0) + 1, // Use nullish coalescing to default to 0
                    lastEmailError: "Failed to send email on retry",
                });
            }
        }
        catch (error) {
            console.error(`Error retrying email for application ${application._id}:`, error);
            yield job_application_model_1.JobApplication.findByIdAndUpdate(application._id, {
                emailStatus: "failed",
                emailRetries: ((_c = application.emailRetries) !== null && _c !== void 0 ? _c : 0) + 1,
                lastEmailError: error instanceof Error ? error.message : String(error),
            });
        }
    }
});
const getSingleJobApplication = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_application_model_1.JobApplication.findById(id).populate("jobPost");
    return result;
});
const getApplicationsByJob = (jobPostId, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield job_application_model_1.JobApplication.find({ jobPost: jobPostId })
        .populate("jobPost")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield job_application_model_1.JobApplication.countDocuments({ jobPost: jobPostId });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getApplicationsByEmail = (email, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const result = yield job_application_model_1.JobApplication.find({ applicantEmail: email })
        .populate("jobPost")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield job_application_model_1.JobApplication.countDocuments({ applicantEmail: email });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllJobApplications = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: job_application_constants_1.jobApplicationSearchableFields.map((field) => ({
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
            if (field === "jobPost" && mongoose_1.Types.ObjectId.isValid(value)) {
                return { [field]: new mongoose_1.Types.ObjectId(value) };
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
    const result = yield job_application_model_1.JobApplication.find(whereConditions)
        .populate("jobPost")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield job_application_model_1.JobApplication.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateJobApplication = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_application_model_1.JobApplication.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate("jobPost");
    return result;
});
const updateApplicationStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_application_model_1.JobApplication.findByIdAndUpdate(id, { status }, { new: true }).populate("jobPost");
    return result;
});
const deleteJobApplication = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_application_model_1.JobApplication.findByIdAndDelete(id);
    return result;
});
exports.JobApplicationService = {
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
