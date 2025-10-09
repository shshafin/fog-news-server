"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationValidation = void 0;
const zod_1 = require("zod");
const createJobApplicationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        jobPost: zod_1.z.string({
            required_error: "Job post ID is required",
        }),
        applicantName: zod_1.z
            .string({
            required_error: "Applicant name is required",
        })
            .min(1, "Applicant name is required"),
        applicantEmail: zod_1.z
            .string({
            required_error: "Applicant email is required",
        })
            .email("Invalid email format"),
        phone: zod_1.z.string().optional(),
        coverLetter: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(["submitted", "under-review", "rejected", "shortlisted", "hired"])
            .optional(),
        emailStatus: zod_1.z.enum(["pending", "sent", "failed", "retrying"]).optional(),
    }),
});
const updateJobApplicationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        applicantName: zod_1.z.string().min(1, "Applicant name is required").optional(),
        applicantEmail: zod_1.z.string().email("Invalid email format").optional(),
        phone: zod_1.z.string().optional(),
        coverLetter: zod_1.z.string().optional(),
        status: zod_1.z
            .enum(["submitted", "under-review", "rejected", "shortlisted", "hired"])
            .optional(),
        emailStatus: zod_1.z.enum(["pending", "sent", "failed", "retrying"]).optional(),
        emailSentAt: zod_1.z.string().optional(),
        emailRetries: zod_1.z.number().optional(),
        lastEmailError: zod_1.z.string().optional(),
    }),
});
const updateApplicationStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["submitted", "under-review", "rejected", "shortlisted", "hired"], {
            required_error: "Status is required",
        }),
    }),
});
exports.JobApplicationValidation = {
    createJobApplicationZodSchema,
    updateJobApplicationZodSchema,
    updateApplicationStatusZodSchema,
};
