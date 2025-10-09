import { z } from "zod";

// Create ePaper validation
const createEpaperZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    date: z.date().optional().default(new Date()),
    file: z.string({ required_error: "PDF URL is required" }),
    thumbnail: z.string(),
    edition: z.string(),
    category: z.string().optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

// Update ePaper validation
const updateEpaperZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    file: z.string().optional(),
    thumbnail: z.string().optional(),
    edition: z.string().optional(),
    category: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const EpaperValidation = {
  createEpaperZodSchema,
  updateEpaperZodSchema,
};
