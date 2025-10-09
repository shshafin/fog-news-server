"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettingsValidation = exports.updateSiteSettingsZodSchema = exports.createSiteSettingsZodSchema = void 0;
const zod_1 = require("zod");
const multilingualSchema = zod_1.z.object({
    en: zod_1.z.string({ required_error: "English text is required" }),
    bn: zod_1.z.string({ required_error: "Bengali text is required" }),
});
const socialLinksSchema = zod_1.z.object({
    facebook: zod_1.z.string().url().optional(),
    twitter: zod_1.z.string().url().optional(),
    instagram: zod_1.z.string().url().optional(),
    youtube: zod_1.z.string().url().optional(),
});
exports.createSiteSettingsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        siteName: multilingualSchema,
        siteDescription: multilingualSchema,
        logo: zod_1.z.string({ required_error: "Logo is required" }),
        favicon: zod_1.z.string({ required_error: "Favicon is required" }),
        socialLinks: socialLinksSchema.optional(),
        language: zod_1.z.enum(["en", "bn"]).default("bn"),
    }),
});
exports.updateSiteSettingsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        siteName: multilingualSchema.partial().optional(),
        siteDescription: multilingualSchema.partial().optional(),
        logo: zod_1.z.string().optional(),
        favicon: zod_1.z.string().optional(),
        socialLinks: socialLinksSchema.optional(),
        language: zod_1.z.enum(["en", "bn"]).optional(),
    }),
});
exports.SiteSettingsValidation = {
    createSiteSettingsZodSchema: exports.createSiteSettingsZodSchema,
    updateSiteSettingsZodSchema: exports.updateSiteSettingsZodSchema,
};
