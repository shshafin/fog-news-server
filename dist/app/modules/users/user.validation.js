"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z
            .string({
            required_error: "Role is required",
        })
            .default("user"),
        firstName: zod_1.z.string({
            required_error: "First name is required",
        }),
        lastName: zod_1.z.string({
            required_error: "Last name is required",
        }),
        username: zod_1.z.string({
            required_error: "user name is required",
        }),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email format"),
        phone: zod_1.z.string({
            required_error: "Phone number is required",
        }),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(8, "Password must be at least 8 characters"),
        needsPasswordChange: zod_1.z.boolean().optional(),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        username: zod_1.z.string().optional(),
        email: zod_1.z.string().email("Invalid email format").optional(),
        phone: zod_1.z.string().optional(),
    }),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email format"),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
    loginUserZodSchema,
};
