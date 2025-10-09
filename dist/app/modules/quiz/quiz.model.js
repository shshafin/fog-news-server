"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSubmission = exports.Quiz = exports.QuizQuestion = void 0;
const mongoose_1 = require("mongoose");
// Question Schema
const QuizQuestionSchema = new mongoose_1.Schema({
    question: { type: String, required: true, trim: true },
    options: [
        {
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
        },
    ],
    explanation: { type: String },
    points: { type: Number, default: 1 },
    category: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    language: {
        type: String,
        enum: ["en", "bn"],
        default: "bn",
    },
}, { timestamps: true });
// Quiz Schema
const QuizSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    questions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "QuizQuestion" }],
    duration: { type: Number }, // in minutes
    passingScore: { type: Number },
    isPublished: { type: Boolean, default: false },
    language: {
        type: String,
        enum: ["en", "bn"],
        default: "bn",
    },
}, { timestamps: true });
// Quiz Submission Schema
const QuizSubmissionSchema = new mongoose_1.Schema({
    quiz: { type: mongoose_1.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [
        {
            question: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "QuizQuestion",
                required: true,
            },
            selectedOption: { type: Number, required: true },
            isCorrect: { type: Boolean, required: true },
        },
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    language: {
        type: String,
        enum: ["en", "bn"],
        default: "bn",
    },
}, { timestamps: true });
exports.QuizQuestion = (0, mongoose_1.model)("QuizQuestion", QuizQuestionSchema);
exports.Quiz = (0, mongoose_1.model)("Quiz", QuizSchema);
exports.QuizSubmission = (0, mongoose_1.model)("QuizSubmission", QuizSubmissionSchema);
