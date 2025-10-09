"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterValidation = void 0;
const zod_1 = require("zod");
const subscribeEmailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Please provide a valid email address"),
    }),
});
const unsubscribeEmailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Please provide a valid email address"),
    }),
});
const getSubscriptionStatusZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Please provide a valid email address"),
    }),
});
exports.NewsletterValidation = {
    subscribeEmailZodSchema,
    unsubscribeEmailZodSchema,
    getSubscriptionStatusZodSchema,
};
