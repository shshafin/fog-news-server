import { z } from "zod";

const multilingualSchema = z.object({
  en: z.string({ required_error: "English text is required" }),
  bn: z.string({ required_error: "Bengali text is required" }),
});

const socialLinksSchema = z.object({
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
});

export const createSiteSettingsZodSchema = z.object({
  body: z.object({
    siteName: multilingualSchema,
    siteDescription: multilingualSchema,
    logo: z.string({ required_error: "Logo is required" }),
    favicon: z.string({ required_error: "Favicon is required" }),
    socialLinks: socialLinksSchema.optional(),
    language: z.enum(["en", "bn"]).default("bn"),
  }),
});

export const updateSiteSettingsZodSchema = z.object({
  body: z.object({
    siteName: multilingualSchema.partial().optional(),
    siteDescription: multilingualSchema.partial().optional(),
    logo: z.string().optional(),
    favicon: z.string().optional(),
    socialLinks: socialLinksSchema.optional(),
    language: z.enum(["en", "bn"]).optional(),
  }),
});

export const SiteSettingsValidation = {
  createSiteSettingsZodSchema,
  updateSiteSettingsZodSchema,
};
