"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const comment_validation_1 = require("./comment.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/create", (0, validateRequest_1.default)(comment_validation_1.CommentValidation.createCommentZodSchema), comment_controller_1.CommentController.createComment);
router.get("/:newsId", comment_controller_1.CommentController.getAllCommentByNews);
router.patch("/:id", (0, validateRequest_1.default)(comment_validation_1.CommentValidation.updateCommentZodSchema), comment_controller_1.CommentController.updateComment);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), comment_controller_1.CommentController.deleteComment);
exports.CommentRoutes = router;
