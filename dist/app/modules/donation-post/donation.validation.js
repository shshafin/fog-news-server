"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationValidation = void 0;
const zod_1 = require("zod");
const createDonationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        description: zod_1.z.string({
            required_error: "Description is required",
        }),
        targetAmount: zod_1.z.number().min(0).optional(),
        category: zod_1.z.string().optional(),
        featuredImage: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const updateDonationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        targetAmount: zod_1.z.number().min(0).optional(),
        category: zod_1.z.string().optional(),
        featuredImage: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const addDonationTransactionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().min(1, "Amount must be at least 1"),
        donorName: zod_1.z.string({
            required_error: "Donor name is required",
        }),
        donorEmail: zod_1.z.string().email("Invalid email format"),
        transactionId: zod_1.z.string({
            required_error: "Transaction ID is required",
        }),
        paymentMethod: zod_1.z.string().optional().default("sslcommerz"),
    }),
});
exports.DonationValidation = {
    createDonationZodSchema,
    updateDonationZodSchema,
    addDonationTransactionZodSchema,
};
