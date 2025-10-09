import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { QuizController } from "./quiz.controller";
import { QuizValidation } from "./quiz.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create-with-questions",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  QuizController.createQuizWithQuestions
);

// Question Routes
router.post(
  "/questions",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(QuizValidation.createQuestionSchema),
  QuizController.createQuestion
);

router.get("/questions", QuizController.getQuestions);
router.get("/questions/:id", QuizController.getQuestionById);
router.patch(
  "/questions/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  QuizController.updateQuestion
);
router.delete(
  "/questions/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  QuizController.deleteQuestion
);

// Quiz Routes
router.post(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(QuizValidation.createQuizSchema),
  QuizController.createQuiz
);

router.get("/quizzes", QuizController.getAllQuizzes);
router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  QuizController.updateQuiz
);
router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  QuizController.deleteQuiz
);

router.get("/quizzes/published", QuizController.getPublishedQuizzes);
router.get("/quizzes/:id", QuizController.getQuizById);

// Submission Routes (protected routes)
router.post(
  "/:quizId/submit",
  auth(),
  validateRequest(QuizValidation.submitQuizSchema),
  QuizController.submitQuiz
);

router.get("/submissions/:submissionId", auth(), QuizController.getQuizResults);

export const QuizRoutes = router;
