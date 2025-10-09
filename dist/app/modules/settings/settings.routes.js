"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettingsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const settings_validation_1 = require("./settings.validation");
const settings_controller_1 = require("./settings.controller");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), fileHandlers_1.uploadFiles, (0, validateRequest_1.default)(settings_validation_1.SiteSettingsValidation.createSiteSettingsZodSchema), settings_controller_1.SiteSettingsController.createOrUpdateSettings);
router.get("/", settings_controller_1.SiteSettingsController.getSettings);
exports.SiteSettingsRoutes = router;
