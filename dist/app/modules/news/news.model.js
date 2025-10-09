"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.News = void 0;
const mongoose_1 = require("mongoose");
const NewsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subTitle: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    publishDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
    },
    feature: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: [String],
        default: [],
    },
    media: {
        type: [String],
        default: [],
    },
    language: {
        type: String,
        enum: ["en", "bn"],
        default: "bn",
    },
    seo: {
        metaTitle: {
            type: String,
            trim: true,
        },
        metaDescription: {
            type: String,
            trim: true,
        },
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Index for title and category (you can add more fields if needed)
NewsSchema.index({ title: 1, category: 1 }, { unique: true });
exports.News = (0, mongoose_1.model)("News", NewsSchema);
