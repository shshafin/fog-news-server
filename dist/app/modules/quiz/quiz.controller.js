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
exports.QuizController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const quiz_service_1 = require("./quiz.service");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const quiz_constants_1 = require("./quiz.constants");
const pagination_1 = require("../../../constants/pagination");
const createQuizWithQuestions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { questions } = _a, quizData = __rest(_a, ["questions"]);
    const result = yield quiz_service_1.QuizService.createQuizWithQuestions(Object.assign(Object.assign({}, quizData), { questions: questions }));
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: "Quiz created with questions successfully",
        data: result,
    });
}));
// Question Controllers
const createQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield quiz_service_1.QuizService.createQuestion(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Question created successfully",
        data: result,
    });
}));
const getQuestions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_service_1.QuizService.getQuestions();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Questions retrieved successfully",
        data: result,
    });
}));
const getQuestionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield quiz_service_1.QuizService.getQuestionById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Question not found");
    }
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Question fetched successfully",
        data: result,
    });
}));
const updateQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield quiz_service_1.QuizService.updateQuestion(id, payload);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Question updated successfully",
        data: result,
    });
}));
const deleteQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield quiz_service_1.QuizService.deleteQuestion(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Question deleted successfully",
        data: null,
    });
}));
// Quiz Controllers
const createQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield quiz_service_1.QuizService.createQuiz(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Quiz created successfully",
        data: result,
    });
}));
const getPublishedQuizzes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield quiz_service_1.QuizService.getPublishedQuizzes();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Published quizzes retrieved successfully",
        data: result,
    });
}));
const getQuizById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield quiz_service_1.QuizService.getQuizById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quiz retrieved successfully",
        data: result,
    });
}));
const getAllQuizzes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, quiz_constants_1.quizFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield quiz_service_1.QuizService.getAllQuizzes(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quizzes fetched successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const updateQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    const result = yield quiz_service_1.QuizService.updateQuiz(id, payload);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Quiz updated successfully",
        data: result,
    });
}));
const deleteQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield quiz_service_1.QuizService.deleteQuiz(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Quiz deleted successfully",
        data: null,
    });
}));
// Submission Controllers
const submitQuiz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizId = req.params.quizId;
    const answers = req.body.answers;
    const result = yield quiz_service_1.QuizService.submitQuiz(quizId, answers);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Quiz submitted successfully",
        data: result,
    });
}));
const getQuizResults = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const submissionId = req.params.submissionId;
    const result = yield quiz_service_1.QuizService.getQuizResults(submissionId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Quiz results retrieved successfully",
        data: result,
    });
}));
exports.QuizController = {
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
