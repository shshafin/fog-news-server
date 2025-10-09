"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const quiz_model_1 = require("./quiz.model");
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const quiz_constants_1 = require("./quiz.constants");
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
const createQuizWithQuestions = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate all questions first
        for (const question of payload.questions) {
            if (!question.options.some((opt) => opt.isCorrect)) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "At least one option must be correct for each question");
            }
        }
        // Create questions
        const createdQuestions = yield quiz_model_1.QuizQuestion.insertMany(payload.questions);
        const questionIds = createdQuestions.map((q) => q._id);
        // Create quiz
        const quizData = Object.assign(Object.assign({}, payload), { questions: questionIds });
        const createdQuiz = yield quiz_model_1.Quiz.create(quizData);
        // Populate and return the quiz
        const populatedQuiz = yield quiz_model_1.Quiz.findById(createdQuiz._id)
            .populate("questions")
            .exec();
        if (!populatedQuiz) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Quiz not found after creation");
        }
        return populatedQuiz;
    }
    catch (error) {
        throw error;
    }
});
// Question Services
const createQuestion = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate that at least one option is correct
    const hasCorrectOption = payload.options.some((option) => option.isCorrect);
    if (!hasCorrectOption) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "At least one option must be correct");
    }
    return quiz_model_1.QuizQuestion.create(payload);
});
const getQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_model_1.QuizQuestion.find({});
    return result;
});
const getQuestionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return quiz_model_1.QuizQuestion.findById(id);
});
const updateQuestion = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.options) {
        const hasCorrectOption = payload.options.some((option) => option.isCorrect);
        if (!hasCorrectOption) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "At least one option must be correct");
        }
    }
    return quiz_model_1.QuizQuestion.findByIdAndUpdate(id, payload, { new: true });
});
const deleteQuestion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield quiz_model_1.QuizQuestion.findById(id);
    if (!question) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Question not found");
    }
    // Check if question is used in any quiz
    const quizUsingQuestion = yield quiz_model_1.Quiz.findOne({ questions: id });
    if (quizUsingQuestion) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot delete question used in quizzes");
    }
    yield quiz_model_1.QuizQuestion.findByIdAndDelete(id);
});
const createQuiz = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_model_1.Quiz.create(payload);
    return result;
});
const getPublishedQuizzes = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_model_1.Quiz.find({ isPublished: true }).populate("questions");
    return result;
});
const getQuizById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_model_1.Quiz.findById(id).populate("questions");
    return result;
});
// const getAllQuizzes = async (): Promise<IQuiz[]> => {
//   return Quiz.find().populate("questions").sort({ createdAt: -1 });
// };
const getAllQuizzes = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Search implementation
    if (searchTerm) {
        andConditions.push({
            $or: quiz_constants_1.quizSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // Filters implementation
    if (Object.keys(filtersData).length) {
        const filterConditions = Object.entries(filtersData).map(([field, value]) => {
            // Handle boolean values
            if (field === "isPublished") {
                return { [field]: value === "true" || value === true };
            }
            return { [field]: value };
        });
        andConditions.push({ $and: filterConditions });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // Default sort by createdAt descending if no sort specified
    if (Object.keys(sortConditions).length === 0) {
        sortConditions["createdAt"] = -1;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield quiz_model_1.Quiz.find(whereConditions)
        .populate("questions")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield quiz_model_1.Quiz.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateQuiz = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield quiz_model_1.Quiz.findById(id);
    if (!quiz) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Quiz not found");
    }
    // Prevent publishing without questions
    if (payload.isPublished && quiz.questions.length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cannot publish quiz without questions");
    }
    return quiz_model_1.Quiz.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("questions");
});
const deleteQuiz = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield quiz_model_1.Quiz.findById(id);
    if (!quiz) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Quiz not found");
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Delete all submissions for this quiz
        yield quiz_model_1.QuizSubmission.deleteMany({ quiz: id }).session(session);
        // Delete the quiz
        yield quiz_model_1.Quiz.findByIdAndDelete(id).session(session);
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// Submission Services
const submitQuiz = (quizId, answers) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield quiz_model_1.Quiz.findById(quizId).populate("questions");
    if (!quiz) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Quiz not found");
    }
    // Validate all questions belong to this quiz
    const questionIds = quiz.questions.map((q) => q._id ? q._id.toString() : q.toString());
    const invalidQuestions = answers.filter((a) => !questionIds.includes(a.questionId));
    if (invalidQuestions.length > 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Some questions do not belong to this quiz");
    }
    // Calculate score
    let score = 0;
    const detailedAnswers = yield Promise.all(answers.map((_a) => __awaiter(void 0, [_a], void 0, function* ({ questionId, selectedOption }) {
        var _b;
        const question = yield quiz_model_1.QuizQuestion.findById(questionId);
        if (!question) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Question ${questionId} not found`);
        }
        const isCorrect = ((_b = question.options[selectedOption]) === null || _b === void 0 ? void 0 : _b.isCorrect) || false;
        if (isCorrect) {
            score += question.points;
        }
        return {
            question: question._id,
            selectedOption,
            isCorrect,
        };
    })));
    // Create submission
    const submission = yield quiz_model_1.QuizSubmission.create({
        quiz: quizId,
        answers: detailedAnswers,
        score,
        totalQuestions: quiz.questions.length,
    });
    const result = yield submission.populate("quiz answers.question");
    return result;
});
const getQuizResults = (submissionId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_model_1.QuizSubmission.findById(submissionId).populate("quiz answers.question");
    return result;
});
exports.QuizService = {
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
