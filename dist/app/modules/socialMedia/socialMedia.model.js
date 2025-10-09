"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMedia = void 0;
const mongoose_1 = require("mongoose");
// Define your simplified schema with only `videoId`, `title`, and `isActive`
const SocialMediaSchema = new mongoose_1.Schema({
    videoId: {
        type: String,
        required: true, // videoId is required
    },
    title: {
        type: String,
        required: true, // title is required
    },
    isActive: {
        type: Boolean,
        default: true, // Default value for isActive is true
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: {
        virtuals: true, // Include virtual fields in JSON output
    },
});
// Create and export the SocialMedia model
exports.SocialMedia = (0, mongoose_1.model)("SocialMedia", SocialMediaSchema);
