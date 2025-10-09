"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollValidation = void 0;
const zod_1 = require("zod");
const createPollZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        question: zod_1.z.string({
            required_error: "Question is required",
        }),
        options: zod_1.z
            .array(zod_1.z.object({
            option: zod_1.z.string({
                required_error: "Option text is required",
            }),
        }))
            .min(2, "At least two options are required"),
    }),
});
const updatePollZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        question: zod_1.z.string().optional(),
        options: zod_1.z
            .array(zod_1.z.object({
            option: zod_1.z.string().optional(),
            votes: zod_1.z.number().optional(),
        }))
            .optional(),
    }),
});
const voteForOptionZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        pollId: zod_1.z.string({
            required_error: "Poll ID is required",
        }),
        optionId: zod_1.z.string({
            required_error: "Option id is required",
        }),
    }),
});
exports.PollValidation = {
    createPollZodSchema,
    updatePollZodSchema,
    voteForOptionZodSchema,
};
