"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = require("zod");
const createCommentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        news: zod_1.z.string({
            required_error: "News ID is required",
        }),
        comment: zod_1.z.string({
            required_error: "Comment text is required",
        }),
    }),
});
const updateCommentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        news: zod_1.z.string().optional(),
        comment: zod_1.z.string().optional(),
    }),
});
exports.CommentValidation = {
    createCommentZodSchema,
    updateCommentZodSchema,
};
