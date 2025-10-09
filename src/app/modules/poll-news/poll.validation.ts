import { z } from "zod";

const createPollZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    question: z.string({
      required_error: "Question is required",
    }),
    options: z
      .array(
        z.object({
          option: z.string({
            required_error: "Option text is required",
          }),
        })
      )
      .min(2, "At least two options are required"),
  }),
});

const updatePollZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    question: z.string().optional(),
    options: z
      .array(
        z.object({
          option: z.string().optional(),
          votes: z.number().optional(),
        })
      )
      .optional(),
  }),
});

const voteForOptionZodSchema = z.object({
  params: z.object({
    pollId: z.string({
      required_error: "Poll ID is required",
    }),
    optionId: z.string({
      required_error: "Option id is required",
    }),
  }),
});

export const PollValidation = {
  createPollZodSchema,
  updatePollZodSchema,
  voteForOptionZodSchema,
};
