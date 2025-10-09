"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidation = void 0;
const zod_1 = require("zod");
const createJobZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: "Title is required",
        }),
        description: zod_1.z
            .string({
            required_error: "Description is required",
        }),
        requirements: zod_1.z.array(zod_1.z.string()).nonempty({
            message: "At least one requirement is required",
        }),
        company: zod_1.z.string({
            required_error: "Company is required",
        }),
        location: zod_1.z.string({
            required_error: "Location is required",
        }),
        salary: zod_1.z.string({
            required_error: "Salary is required",
        }),
        applicationDeadline: zod_1.z.string({
            required_error: "Application deadline is required",
        }),
        contactEmail: zod_1.z
            .string({
            required_error: "Contact email is required",
        })
            .email("Invalid email format"),
        jobType: zod_1.z.enum(["full-time", "part-time", "contract", "freelance", "internship"], {
            required_error: "Job type is required",
        }),
        category: zod_1.z.string({
            required_error: "Category is required",
        }),
        experienceLevel: zod_1.z.enum(["entry", "mid", "senior", "executive"], {
            required_error: "Experience level is required",
        }),
        education: zod_1.z.array(zod_1.z.string()).optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional().default(true),
        image: zod_1.z.string().optional().nullable(),
    }),
});
const updateJobZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        requirements: zod_1.z.array(zod_1.z.string()).optional(),
        company: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        salary: zod_1.z.string().optional(),
        applicationDeadline: zod_1.z.string().optional(),
        contactEmail: zod_1.z.string().email("Invalid email format").optional(),
        jobType: zod_1.z
            .enum(["full-time", "part-time", "contract", "freelance", "internship"])
            .optional(),
        category: zod_1.z.string().optional(),
        experienceLevel: zod_1.z.enum(["entry", "mid", "senior", "executive"]).optional(),
        education: zod_1.z.array(zod_1.z.string()).optional(),
        skills: zod_1.z.array(zod_1.z.string()).optional(),
        isActive: zod_1.z.boolean().optional(),
        image: zod_1.z.string().optional().nullable(),
    }),
});
exports.JobValidation = {
    createJobZodSchema,
    updateJobZodSchema,
};
