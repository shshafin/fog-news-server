import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { QuizService } from "./quiz.service";
import { IQuiz, IQuizQuestion, IQuizSubmission } from "./quiz.interface";
import ApiError from "../../../errors/ApiError";
import pick from "../../../shared/pick";
import { quizFilterableFields } from "./quiz.constants";
import { paginationFields } from "../../../constants/pagination";

const createQuizWithQuestions = catchAsync(
  async (req: Request, res: Response) => {
    const { questions, ...quizData } = req.body;

    const result = await QuizService.createQuizWithQuestions({
      ...quizData,
      questions: questions as IQuizQuestion[], // Cast to proper type
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Quiz created with questions successfully",
      data: result,
    });
  }
);

// Question Controllers
const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await QuizService.createQuestion(payload);

  sendResponse<IQuizQuestion>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Question created successfully",
    data: result,
  });
});

const getQuestions = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.getQuestions();

  sendResponse<IQuizQuestion[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Questions retrieved successfully",
    data: result,
  });
});

const getQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await QuizService.getQuestionById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Question fetched successfully",
    data: result,
  });
});

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await QuizService.updateQuestion(id, payload);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Question updated successfully",
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await QuizService.deleteQuestion(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Question deleted successfully",
    data: null,
  });
});

// Quiz Controllers
const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await QuizService.createQuiz(payload);

  sendResponse<IQuiz>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quiz created successfully",
    data: result,
  });
});

const getPublishedQuizzes = catchAsync(async (req: Request, res: Response) => {
  const result = await QuizService.getPublishedQuizzes();

  sendResponse<IQuiz[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Published quizzes retrieved successfully",
    data: result,
  });
});

const getQuizById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await QuizService.getQuizById(id);

  sendResponse<IQuiz>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz retrieved successfully",
    data: result,
  });
});

const getAllQuizzes = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, quizFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await QuizService.getAllQuizzes(filters, paginationOptions);

  sendResponse<IQuiz[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizzes fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await QuizService.updateQuiz(id, payload);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Quiz updated successfully",
    data: result,
  });
});

const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await QuizService.deleteQuiz(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: "Quiz deleted successfully",
    data: null,
  });
});

// Submission Controllers
const submitQuiz = catchAsync(async (req: Request, res: Response) => {
  const quizId = req.params.quizId;
  const answers = req.body.answers;

  const result = await QuizService.submitQuiz(quizId, answers);

  sendResponse<IQuizSubmission>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quiz submitted successfully",
    data: result,
  });
});

const getQuizResults = catchAsync(async (req: Request, res: Response) => {
  const submissionId = req.params.submissionId;
  const result = await QuizService.getQuizResults(submissionId);

  sendResponse<IQuizSubmission>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz results retrieved successfully",
    data: result,
  });
});

export const QuizController = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  createQuiz,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  getPublishedQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  createQuizWithQuestions,
};
