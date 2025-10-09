"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const quiz_controller_1 = require("./quiz.controller");
const quiz_validation_1 = require("./quiz.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/create-with-questions", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), quiz_controller_1.QuizController.createQuizWithQuestions);
// Question Routes
router.post("/questions", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (0, validateRequest_1.default)(quiz_validation_1.QuizValidation.createQuestionSchema), quiz_controller_1.QuizController.createQuestion);
router.get("/questions", quiz_controller_1.QuizController.getQuestions);
router.get("/questions/:id", quiz_controller_1.QuizController.getQuestionById);
router.patch("/questions/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), quiz_controller_1.QuizController.updateQuestion);
router.delete("/questions/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), quiz_controller_1.QuizController.deleteQuestion);
// Quiz Routes
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (0, validateRequest_1.default)(quiz_validation_1.QuizValidation.createQuizSchema), quiz_controller_1.QuizController.createQuiz);
router.get("/quizzes", quiz_controller_1.QuizController.getAllQuizzes);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), quiz_controller_1.QuizController.updateQuiz);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), quiz_controller_1.QuizController.deleteQuiz);
router.get("/quizzes/published", quiz_controller_1.QuizController.getPublishedQuizzes);
router.get("/quizzes/:id", quiz_controller_1.QuizController.getQuizById);
// Submission Routes (protected routes)
router.post("/:quizId/submit", (0, auth_1.default)(), (0, validateRequest_1.default)(quiz_validation_1.QuizValidation.submitQuizSchema), quiz_controller_1.QuizController.submitQuiz);
router.get("/submissions/:submissionId", (0, auth_1.default)(), quiz_controller_1.QuizController.getQuizResults);
exports.QuizRoutes = router;
