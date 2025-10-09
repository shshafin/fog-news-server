import { z } from "zod";

// Schema for creating a social media entry (all fields are required)
const createSocialMediaZodSchema = z.object({
  body: z.object({
    videoId: z.string({
      required_error: "Video Id is required",
    }),
    title: z.string({
      required_error: "Title is required",
    }),
    isActive: z.boolean({
      required_error: "Active status is required",
    }),
  }),
});

// Schema for updating a social media entry (fields are optional)
const updateSocialMediaZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    videoId: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const SocialMediaValidation = {
  createSocialMediaZodSchema,
  updateSocialMediaZodSchema,
};
