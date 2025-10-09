"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
const mongoose_1 = require("mongoose");
const PollSchema = new mongoose_1.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        required: false,
    },
    question: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        enum: ["en", "bn"],
        default: "bn",
    },
    options: [
        {
            option: {
                type: String,
                required: true,
            },
            votes: {
                type: Number,
                default: 0,
            },
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
PollSchema.index({ title: 1, question: 1 }, { unique: true });
exports.Poll = (0, mongoose_1.model)("Poll", PollSchema);
