"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediaValidation = void 0;
const zod_1 = require("zod");
// Schema for creating a social media entry (all fields are required)
const createSocialMediaZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        videoId: zod_1.z.string({
            required_error: "Video Id is required",
        }),
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        isActive: zod_1.z.boolean({
            required_error: "Active status is required",
        }),
    }),
});
// Schema for updating a social media entry (fields are optional)
const updateSocialMediaZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        videoId: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.SocialMediaValidation = {
    createSocialMediaZodSchema,
    updateSocialMediaZodSchema,
};
