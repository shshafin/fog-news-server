import { z } from "zod";

const createJobZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      }),
    description: z
      .string({
        required_error: "Description is required",
      })
     ,
    requirements: z.array(z.string()).nonempty({
      message: "At least one requirement is required",
    }),
    company: z.string({
      required_error: "Company is required",
    }),
    location: z.string({
      required_error: "Location is required",
    }),
    salary: z.string({
      required_error: "Salary is required",
    }),
    applicationDeadline: z.string({
      required_error: "Application deadline is required",
    }),
    contactEmail: z
      .string({
        required_error: "Contact email is required",
      })
      .email("Invalid email format"),
    jobType: z.enum(
      ["full-time", "part-time", "contract", "freelance", "internship"],
      {
        required_error: "Job type is required",
      }
    ),
    category: z.string({
      required_error: "Category is required",
    }),
    experienceLevel: z.enum(["entry", "mid", "senior", "executive"], {
      required_error: "Experience level is required",
    }),
    education: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    isActive: z.boolean().optional().default(true),
    image: z.string().optional().nullable(),
  }),
});

const updateJobZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    requirements: z.array(z.string()).optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    salary: z.string().optional(),
    applicationDeadline: z.string().optional(),
    contactEmail: z.string().email("Invalid email format").optional(),
    jobType: z
      .enum(["full-time", "part-time", "contract", "freelance", "internship"])
      .optional(),
    category: z.string().optional(),
    experienceLevel: z.enum(["entry", "mid", "senior", "executive"]).optional(),
    education: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    image: z.string().optional().nullable(),
  }),
});

export const JobValidation = {
  createJobZodSchema,
  updateJobZodSchema,
};
