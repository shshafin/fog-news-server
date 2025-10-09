import { z } from "zod";

const createDonationZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    targetAmount: z.number().min(0).optional(),
    category: z.string().optional(),
    featuredImage: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateDonationZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    targetAmount: z.number().min(0).optional(),
    category: z.string().optional(),
    featuredImage: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const addDonationTransactionZodSchema = z.object({
  body: z.object({
    amount: z.number().min(1, "Amount must be at least 1"),
    donorName: z.string({
      required_error: "Donor name is required",
    }),
    donorEmail: z.string().email("Invalid email format"),
    transactionId: z.string({
      required_error: "Transaction ID is required",
    }),
    paymentMethod: z.string().optional().default("sslcommerz"),
  }),
});

export const DonationValidation = {
  createDonationZodSchema,
  updateDonationZodSchema,
  addDonationTransactionZodSchema,
};
