"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginZodSchema), auth_controller_1.AuthController.loginUser);
router.post("/refresh-token", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
router.post("/change-password", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordZodSchema), (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), auth_controller_1.AuthController.changePassword);
router.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
// c:\projects\school management software\school-management-system-(backend-NoSQL)\src\app\modules\auth\auth.route.ts
