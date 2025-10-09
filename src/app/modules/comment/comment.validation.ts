import { z } from "zod";

const createCommentZodSchema = z.object({
  body: z.object({
    news: z.string({
      required_error: "News ID is required",
    }),
    comment: z.string({
      required_error: "Comment text is required",
    }),
  }),
});

const updateCommentZodSchema = z.object({
  body: z.object({
    news: z.string().optional(),
    comment: z.string().optional(),
  }),
});

export const CommentValidation = {
  createCommentZodSchema,
  updateCommentZodSchema,
};
