import { z } from "zod";

const createJobApplicationZodSchema = z.object({
  body: z.object({
    jobPost: z.string({
      required_error: "Job post ID is required",
    }),
    applicantName: z
      .string({
        required_error: "Applicant name is required",
      })
      .min(1, "Applicant name is required"),
    applicantEmail: z
      .string({
        required_error: "Applicant email is required",
      })
      .email("Invalid email format"),
    phone: z.string().optional(),
    coverLetter: z.string().optional(),
    status: z
      .enum(["submitted", "under-review", "rejected", "shortlisted", "hired"])
      .optional(),
    emailStatus: z.enum(["pending", "sent", "failed", "retrying"]).optional(),
  }),
});

const updateJobApplicationZodSchema = z.object({
  body: z.object({
    applicantName: z.string().min(1, "Applicant name is required").optional(),
    applicantEmail: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    coverLetter: z.string().optional(),
    status: z
      .enum(["submitted", "under-review", "rejected", "shortlisted", "hired"])
      .optional(),
    emailStatus: z.enum(["pending", "sent", "failed", "retrying"]).optional(),
    emailSentAt: z.string().optional(),
    emailRetries: z.number().optional(),
    lastEmailError: z.string().optional(),
  }),
});

const updateApplicationStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(
      ["submitted", "under-review", "rejected", "shortlisted", "hired"],
      {
        required_error: "Status is required",
      }
    ),
  }),
});

export const JobApplicationValidation = {
  createJobApplicationZodSchema,
  updateJobApplicationZodSchema,
  updateApplicationStatusZodSchema,
};
