"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntertainmentValidation = void 0;
const zod_1 = require("zod");
const createEntertainmentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        media: zod_1.z.string().optional(),
        link: zod_1.z.string().optional(),
        category: zod_1.z.string({
            required_error: "Category ID is required",
        }),
    }),
});
const updateEntertainmentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        media: zod_1.z.string().optional(),
        link: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
    }),
});
exports.EntertainmentValidation = {
    createEntertainmentZodSchema,
    updateEntertainmentZodSchema,
};
