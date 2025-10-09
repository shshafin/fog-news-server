"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const news_controller_1 = require("./news.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), fileHandlers_1.uploadImages, 
// validateRequest(NewsValidation.createNewsZodSchema),
news_controller_1.NewsController.createNews);
router.get("/", news_controller_1.NewsController.getAllNews);
router.get("/:id", news_controller_1.NewsController.getSingleNews);
router.get("/category/:slug", news_controller_1.NewsController.getNewsByCategory);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), fileHandlers_1.uploadImages, 
// validateRequest(NewsValidation.updateNewsZodSchema),
news_controller_1.NewsController.updateNews);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), news_controller_1.NewsController.deleteNews);
exports.NewsRoutes = router;
