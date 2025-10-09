"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Epaper = void 0;
const mongoose_1 = require("mongoose");
const EpaperSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    file: { type: String, required: true },
    thumbnail: { type: String },
    edition: { type: String },
    category: { type: String },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Epaper = (0, mongoose_1.model)("Epaper", EpaperSchema);
