import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IQuiz, IQuizQuestion, IQuizSubmission } from "./quiz.interface";
import { Quiz, QuizQuestion, QuizSubmission } from "./quiz.model";
import mongoose, { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { quizSearchableFields } from "./quiz.constants";

// const createQuizWithQuestions = async (
//   payload: Omit<IQuiz, "questions"> & { questions: IQuizQuestion[] }
// ): Promise<IQuiz> => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const questionCreationPromises = payload.questions.map(async (question) => {
//       if (!question.options.some((opt) => opt.isCorrect)) {
//         throw new ApiError(
//           httpStatus.BAD_REQUEST,
//           "At least one option must be correct"
//         );
//       }
//       return await QuizQuestion.create([question], { session });
//     });

//     const questionResults = await Promise.all(questionCreationPromises);
//     const questionIds = questionResults.flat().map((q) => q._id);

//     const quizData: Omit<IQuiz, "_id"> = {
//       ...payload,
//       questions: questionIds,
//     };

//     const createdQuiz = await Quiz.create([quizData], { session });

//     await session.commitTransaction();

//     const populatedQuiz = await Quiz.findById(createdQuiz[0]._id)
//       .populate("questions")
//       .exec();

//     if (!populatedQuiz) {
//       throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
//     }

//     return populatedQuiz;
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

const createQuizWithQuestions = async (
  payload: Omit<IQuiz, "questions"> & { questions: IQuizQuestion[] }
): Promise<IQuiz> => {
  try {
    // Validate all questions first
    for (const question of payload.questions) {
      if (!question.options.some((opt) => opt.isCorrect)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "At least one option must be correct for each question"
        );
      }
    }

    // Create questions
    const createdQuestions = await QuizQuestion.insertMany(payload.questions);
    const questionIds = createdQuestions.map((q) => q._id);

    // Create quiz
    const quizData = {
      ...payload,
      questions: questionIds,
    };

    const createdQuiz = await Quiz.create(quizData);

    // Populate and return the quiz
    const populatedQuiz = await Quiz.findById(createdQuiz._id)
      .populate("questions")
      .exec();

    if (!populatedQuiz) {
      throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found after creation");
    }

    return populatedQuiz;
  } catch (error) {
    throw error;
  }
};

// Question Services
const createQuestion = async (
  payload: IQuizQuestion
): Promise<IQuizQuestion> => {
  // Validate that at least one option is correct
  const hasCorrectOption = payload.options.some((option) => option.isCorrect);
  if (!hasCorrectOption) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "At least one option must be correct"
    );
  }

  return QuizQuestion.create(payload);
};

const getQuestions = async (): Promise<IQuizQuestion[]> => {
  const result = await QuizQuestion.find({});
  return result;
};

const getQuestionById = async (id: string): Promise<IQuizQuestion | null> => {
  return QuizQuestion.findById(id);
};

const updateQuestion = async (
  id: string,
  payload: Partial<IQuizQuestion>
): Promise<IQuizQuestion | null> => {
  if (payload.options) {
    const hasCorrectOption = payload.options.some((option) => option.isCorrect);
    if (!hasCorrectOption) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "At least one option must be correct"
      );
    }
  }
  return QuizQuestion.findByIdAndUpdate(id, payload, { new: true });
};

const deleteQuestion = async (id: string): Promise<void> => {
  const question = await QuizQuestion.findById(id);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
  }

  // Check if question is used in any quiz
  const quizUsingQuestion = await Quiz.findOne({ questions: id });
  if (quizUsingQuestion) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete question used in quizzes"
    );
  }

  await QuizQuestion.findByIdAndDelete(id);
};

const createQuiz = async (payload: IQuiz): Promise<IQuiz> => {
  const result = await Quiz.create(payload);
  return result;
};

const getPublishedQuizzes = async (): Promise<IQuiz[]> => {
  const result = await Quiz.find({ isPublished: true }).populate("questions");
  return result;
};

const getQuizById = async (id: string): Promise<IQuiz | null> => {
  const result = await Quiz.findById(id).populate("questions");
  return result;
};

// const getAllQuizzes = async (): Promise<IQuiz[]> => {
//   return Quiz.find().populate("questions").sort({ createdAt: -1 });
// };

const getAllQuizzes = async (
  filters: Record<string, any>,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IQuiz[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search implementation
  if (searchTerm) {
    andConditions.push({
      $or: quizSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length) {
    const filterConditions = Object.entries(filtersData).map(
      ([field, value]) => {
        // Handle boolean values
        if (field === "isPublished") {
          return { [field]: value === "true" || value === true };
        }
        return { [field]: value };
      }
    );
    andConditions.push({ $and: filterConditions });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Default sort by createdAt descending if no sort specified
  if (Object.keys(sortConditions).length === 0) {
    sortConditions["createdAt"] = -1;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Quiz.find(whereConditions)
    .populate("questions")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Quiz.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateQuiz = async (
  id: string,
  payload: Partial<IQuiz>
): Promise<IQuiz | null> => {
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  // Prevent publishing without questions
  if (payload.isPublished && quiz.questions.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot publish quiz without questions"
    );
  }

  return Quiz.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("questions");
};

const deleteQuiz = async (id: string): Promise<void> => {
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete all submissions for this quiz
    await QuizSubmission.deleteMany({ quiz: id }).session(session);

    // Delete the quiz
    await Quiz.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Submission Services
const submitQuiz = async (
  quizId: string,
  answers: Array<{ questionId: string; selectedOption: number }>
): Promise<IQuizSubmission> => {
  const quiz = await Quiz.findById(quizId).populate("questions");
  if (!quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, "Quiz not found");
  }

  // Validate all questions belong to this quiz
  const questionIds = quiz.questions.map((q: any) =>
    q._id ? q._id.toString() : q.toString()
  );
  const invalidQuestions = answers.filter(
    (a) => !questionIds.includes(a.questionId)
  );
  if (invalidQuestions.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Some questions do not belong to this quiz"
    );
  }

  // Calculate score
  let score = 0;
  const detailedAnswers = await Promise.all(
    answers.map(async ({ questionId, selectedOption }) => {
      const question = await QuizQuestion.findById(questionId);
      if (!question) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `Question ${questionId} not found`
        );
      }

      const isCorrect = question.options[selectedOption]?.isCorrect || false;
      if (isCorrect) {
        score += question.points;
      }

      return {
        question: question._id,
        selectedOption,
        isCorrect,
      };
    })
  );

  // Create submission
  const submission = await QuizSubmission.create({
    quiz: quizId,
    answers: detailedAnswers,
    score,
    totalQuestions: quiz.questions.length,
  });

  const result = await submission.populate("quiz answers.question");
  return result;
};

const getQuizResults = async (
  submissionId: string
): Promise<IQuizSubmission | null> => {
  const result = await QuizSubmission.findById(submissionId).populate(
    "quiz answers.question"
  );
  return result;
};

export const QuizService = {
  createQuizWithQuestions,
  // Question services
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,

  // Quiz services
  createQuiz,
  getPublishedQuizzes,
  getQuizById,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,

  // Submission services
  submitQuiz,
  getQuizResults,
};
