"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    news: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Comment = (0, mongoose_1.model)("Comment", CommentSchema);
