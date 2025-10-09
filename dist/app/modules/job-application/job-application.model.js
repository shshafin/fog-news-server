"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplication = void 0;
const mongoose_1 = require("mongoose");
const jobApplicationSchema = new mongoose_1.Schema({
    jobPost: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true,
    },
    applicantName: {
        type: String,
        required: true,
        trim: true,
    },
    applicantEmail: {
        type: String,
        required: true,
        match: [
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            "Invalid email format",
        ],
    },
    phone: {
        type: String,
        trim: true,
    },
    coverLetter: {
        type: String,
        default: "",
    },
    resumePath: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["submitted", "under-review", "rejected", "shortlisted", "hired"],
        default: "submitted",
        index: true,
    },
    appliedDate: {
        type: Date,
        default: Date.now,
    },
    emailStatus: {
        type: String,
        enum: ["pending", "sent", "failed", "retrying"],
        default: "pending",
    },
    emailSentAt: {
        type: Date,
    },
    emailRetries: {
        type: Number,
        default: 0,
    },
    lastEmailError: {
        type: String,
    },
}, { timestamps: true });
// Indexes for faster queries
jobApplicationSchema.index({ applicantEmail: 1 });
jobApplicationSchema.index({ appliedDate: -1 });
jobApplicationSchema.index({ status: 1, emailStatus: 1 });
// Pre-save hook to handle email status
jobApplicationSchema.pre("save", function (next) {
    if (this.isNew) {
        this.emailStatus = "pending";
        this.status = "submitted";
    }
    next();
});
exports.JobApplication = (0, mongoose_1.model)("JobApplication", jobApplicationSchema);
