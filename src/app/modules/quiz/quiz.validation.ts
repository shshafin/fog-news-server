import { z } from "zod";

// Question Validation
const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

const createQuestionSchema = z.object({
  body: z.object({
    question: z.string().min(1, "Question is required"),
    options: z
      .array(optionSchema)
      .min(2, "At least 2 options are required")
      .max(5, "Maximum 5 options allowed")
      .refine((options) => options.some((opt) => opt.isCorrect), {
        message: "At least one option must be correct",
      }),
    explanation: z.string().optional(),
    points: z.number().min(1).default(1),
    category: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  }),
});

// Quiz Validation
const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    questions: z.array(z.string()).min(1, "At least one question is required"),
    duration: z.number().min(1).optional(),
    passingScore: z.number().min(0).optional(),
    isPublished: z.boolean().default(false),
  }),
});

// Submission Validation
const answerSchema = z.object({
  questionId: z.string(),
  selectedOption: z.number().min(0),
});

const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(answerSchema).min(1, "At least one answer is required"),
  }),
});

export const QuizValidation = {
  createQuestionSchema,
  createQuizSchema,
  submitQuizSchema,
};
