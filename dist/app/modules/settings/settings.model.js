"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = void 0;
const mongoose_1 = require("mongoose");
const SiteSettingsSchema = new mongoose_1.Schema({
    siteName: {
        en: {
            type: String,
            required: true,
            trim: true,
        },
        bn: {
            type: String,
            required: true,
            trim: true,
        },
    },
    siteDescription: {
        en: {
            type: String,
            required: true,
            trim: true,
        },
        bn: {
            type: String,
            required: true,
            trim: true,
        },
    },
    logo: {
        type: String,
        required: true,
    },
    favicon: {
        type: String,
        required: true,
    },
    socialLinks: {
        facebook: {
            type: String,
            trim: true,
        },
        twitter: {
            type: String,
            trim: true,
        },
        instagram: {
            type: String,
            trim: true,
        },
        youtube: {
            type: String,
            trim: true,
        },
    },
    language: {
        type: String,
        enum: ["en", "bn"],
        default: "bn",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
SiteSettingsSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield this.model("SiteSettings").countDocuments();
        if (count >= 1) {
            throw new Error("Only one site settings document is allowed");
        }
        next();
    });
});
exports.SiteSettings = (0, mongoose_1.model)("SiteSettings", SiteSettingsSchema);
