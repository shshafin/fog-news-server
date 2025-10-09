import { z } from "zod";

const createAdvertisementZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    targetUrl: z.string({
      required_error: "Target URL is required",
    }),
    target: z
      .enum(["_blank", "_self", "_parent", "_top"])
      .default("_blank")
      .optional(),
    type: z.enum(["banner", "sidebar", "popup", "inline", "sponsored"], {
      required_error: "Type is required",
    }),
    status: z
      .enum(["active", "inactive", "pending", "rejected", "expired"])
      .default("pending")
      .optional(),
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z.string({
      required_error: "End date is required",
    }),
    priority: z.number().default(1).optional(),
  }),
});

const updateAdvertisementZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    targetUrl: z.string().optional(),
    target: z.enum(["_blank", "_self", "_parent", "_top"]).optional(),
    type: z
      .enum(["banner", "sidebar", "popup", "inline", "sponsored"])
      .optional(),
    status: z
      .enum(["active", "inactive", "pending", "rejected", "expired"])
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    priority: z.number().optional(),
  }),
});

export const createAdvertisementSchema = createAdvertisementZodSchema;
export const updateAdvertisementSchema = updateAdvertisementZodSchema;
