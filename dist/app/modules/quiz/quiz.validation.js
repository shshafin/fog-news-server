"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizValidation = void 0;
const zod_1 = require("zod");
// Question Validation
const optionSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, "Option text is required"),
    isCorrect: zod_1.z.boolean(),
});
const createQuestionSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string().min(1, "Question is required"),
        options: zod_1.z
            .array(optionSchema)
            .min(2, "At least 2 options are required")
            .max(5, "Maximum 5 options allowed")
            .refine((options) => options.some((opt) => opt.isCorrect), {
            message: "At least one option must be correct",
        }),
        explanation: zod_1.z.string().optional(),
        points: zod_1.z.number().min(1).default(1),
        category: zod_1.z.string().optional(),
        difficulty: zod_1.z.enum(["easy", "medium", "hard"]).optional(),
    }),
});
// Quiz Validation
const createQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        description: zod_1.z.string().optional(),
        questions: zod_1.z.array(zod_1.z.string()).min(1, "At least one question is required"),
        duration: zod_1.z.number().min(1).optional(),
        passingScore: zod_1.z.number().min(0).optional(),
        isPublished: zod_1.z.boolean().default(false),
    }),
});
// Submission Validation
const answerSchema = zod_1.z.object({
    questionId: zod_1.z.string(),
    selectedOption: zod_1.z.number().min(0),
});
const submitQuizSchema = zod_1.z.object({
    body: zod_1.z.object({
        answers: zod_1.z.array(answerSchema).min(1, "At least one answer is required"),
    }),
});
exports.QuizValidation = {
    createQuestionSchema,
    createQuizSchema,
    submitQuizSchema,
};
