import { Model, Types } from "mongoose";

export interface IQuizOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuizQuestion {
  question: string;
  options: IQuizOption[];
  explanation?: string;
  points: number;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  language?: "en" | "bn";
}

export interface IQuiz {
  title: string;
  description?: string;
  questions: Types.ObjectId[] | IQuizQuestion[];
  duration?: number; // in minutes
  passingScore?: number;
  isPublished: boolean;
  language?: "en" | "bn";
}

export interface IQuizSubmission {
  quiz: Types.ObjectId;
  answers: {
    question: Types.ObjectId;
    selectedOption: number; // index of selected option
    isCorrect: boolean;
  }[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
  language?: "en" | "bn";
}

export type IQuizModel = Model<IQuiz>;
export type IQuizQuestionModel = Model<IQuizQuestion>;
export type IQuizSubmissionModel = Model<IQuizSubmission>;
