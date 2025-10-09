"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdvertisementSchema = exports.createAdvertisementSchema = void 0;
const zod_1 = require("zod");
const createAdvertisementZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        description: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
        targetUrl: zod_1.z.string({
            required_error: "Target URL is required",
        }),
        target: zod_1.z
            .enum(["_blank", "_self", "_parent", "_top"])
            .default("_blank")
            .optional(),
        type: zod_1.z.enum(["banner", "sidebar", "popup", "inline", "sponsored"], {
            required_error: "Type is required",
        }),
        status: zod_1.z
            .enum(["active", "inactive", "pending", "rejected", "expired"])
            .default("pending")
            .optional(),
        startDate: zod_1.z.string({
            required_error: "Start date is required",
        }),
        endDate: zod_1.z.string({
            required_error: "End date is required",
        }),
        priority: zod_1.z.number().default(1).optional(),
    }),
});
const updateAdvertisementZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
        targetUrl: zod_1.z.string().optional(),
        target: zod_1.z.enum(["_blank", "_self", "_parent", "_top"]).optional(),
        type: zod_1.z
            .enum(["banner", "sidebar", "popup", "inline", "sponsored"])
            .optional(),
        status: zod_1.z
            .enum(["active", "inactive", "pending", "rejected", "expired"])
            .optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        priority: zod_1.z.number().optional(),
    }),
});
exports.createAdvertisementSchema = createAdvertisementZodSchema;
exports.updateAdvertisementSchema = updateAdvertisementZodSchema;
