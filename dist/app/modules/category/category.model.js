"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    parentCategory: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    image: {
        type: String,
        default: "",
    },
    language: {
        type: String,
        enum: ["en", "bn"],
        default: "bn",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Index for slug (ensure uniqueness)
CategorySchema.index({ name: 1, slug: 1 }, { unique: true });
CategorySchema.virtual("children", {
    ref: "Category",
    localField: "_id",
    foreignField: "parentCategory",
});
exports.Category = (0, mongoose_1.model)("Category", CategorySchema);
