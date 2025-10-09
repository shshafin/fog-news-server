"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Advertisement = void 0;
const mongoose_1 = require("mongoose");
const AdvertisementSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    targetUrl: { type: String, required: true },
    target: {
        type: String,
        enum: ["_blank", "_self", "_parent", "_top"],
        default: "_blank",
    },
    type: {
        type: String,
        enum: ["banner", "sidebar", "popup", "inline", "sponsored"],
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "pending", "rejected", "expired"],
        default: "pending",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: Number, default: 1 },
}, { timestamps: true });
exports.Advertisement = (0, mongoose_1.model)("Advertisement", AdvertisementSchema);
