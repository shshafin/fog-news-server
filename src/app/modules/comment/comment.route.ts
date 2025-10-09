import express from "express";
import { CommentController } from "./comment.controller";
import { CommentValidation } from "./comment.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  validateRequest(CommentValidation.createCommentZodSchema),
  CommentController.createComment
);

router.get("/:newsId", CommentController.getAllCommentByNews);

router.patch(
  "/:id",
  validateRequest(CommentValidation.updateCommentZodSchema),
  CommentController.updateComment
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  CommentController.deleteComment
);

export const CommentRoutes = router;
