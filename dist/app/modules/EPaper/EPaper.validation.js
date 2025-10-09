"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpaperValidation = void 0;
const zod_1 = require("zod");
// Create ePaper validation
const createEpaperZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        date: zod_1.z.date().optional().default(new Date()),
        file: zod_1.z.string({ required_error: "PDF URL is required" }),
        thumbnail: zod_1.z.string(),
        edition: zod_1.z.string(),
        category: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
// Update ePaper validation
const updateEpaperZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        file: zod_1.z.string().optional(),
        thumbnail: zod_1.z.string().optional(),
        edition: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.EpaperValidation = {
    createEpaperZodSchema,
    updateEpaperZodSchema,
};
