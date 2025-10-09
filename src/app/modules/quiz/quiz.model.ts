import { Schema, model } from "mongoose";
import {
  IQuiz,
  IQuizModel,
  IQuizQuestion,
  IQuizQuestionModel,
  IQuizSubmission,
  IQuizSubmissionModel,
} from "./quiz.interface";

// Question Schema
const QuizQuestionSchema = new Schema<IQuizQuestion, IQuizQuestionModel>(
  {
    question: { type: String, required: true, trim: true },
    options: [
      {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    explanation: { type: String },
    points: { type: Number, default: 1 },
    category: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "bn",
    },
  },
  { timestamps: true }
);

// Quiz Schema
const QuizSchema = new Schema<IQuiz, IQuizModel>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: "QuizQuestion" }],
    duration: { type: Number }, // in minutes
    passingScore: { type: Number },
    isPublished: { type: Boolean, default: false },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "bn",
    },
  },
  { timestamps: true }
);

// Quiz Submission Schema
const QuizSubmissionSchema = new Schema<IQuizSubmission, IQuizSubmissionModel>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: "QuizQuestion",
          required: true,
        },
        selectedOption: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    language: {
      type: String,
      enum: ["en", "bn"],
      default: "bn",
    },
  },
  { timestamps: true }
);

export const QuizQuestion = model<IQuizQuestion, IQuizQuestionModel>(
  "QuizQuestion",
  QuizQuestionSchema
);
export const Quiz = model<IQuiz, IQuizModel>("Quiz", QuizSchema);
export const QuizSubmission = model<IQuizSubmission, IQuizSubmissionModel>(
  "QuizSubmission",
  QuizSubmissionSchema
);
