"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entertainment = void 0;
const mongoose_1 = require("mongoose");
const entertainmentSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    media: {
        type: String,
        required: false,
    },
    link: { type: String, required: false },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Entertainment = (0, mongoose_1.model)("Entertainment", entertainmentSchema);
