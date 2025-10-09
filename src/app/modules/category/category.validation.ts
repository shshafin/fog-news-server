import { z } from "zod";

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Category name is required",
    }),
    slug: z
      .string({
        required_error: "Category slug is required",
      })
      .optional(),
    parentCategory: z.string().optional(),
    image: z.string().optional(),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    parentCategory: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
