import { z } from "zod";

const subscribeEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Please provide a valid email address"),
  }),
});

const unsubscribeEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Please provide a valid email address"),
  }),
});

const getSubscriptionStatusZodSchema = z.object({
  params: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Please provide a valid email address"),
  }),
});

export const NewsletterValidation = {
  subscribeEmailZodSchema,
  unsubscribeEmailZodSchema,
  getSubscriptionStatusZodSchema,
};
