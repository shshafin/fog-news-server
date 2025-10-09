import { z } from "zod";

const createEntertainmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    media: z.string().optional(),
    link: z.string().optional(),
    category: z.string({
      required_error: "Category ID is required",
    }),
  }),
});

const updateEntertainmentZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    media: z.string().optional(),
    link: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const EntertainmentValidation = {
  createEntertainmentZodSchema,
  updateEntertainmentZodSchema,
};
