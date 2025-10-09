"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpaperRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const EPaper_controller_1 = require("./EPaper.controller");
const user_1 = require("../../../enum/user");
const EPaper_validation_1 = require("./EPaper.validation");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
// Public routes (read-only)
router.get("/", EPaper_controller_1.EpaperController.getAllEpapers);
router.get("/:id", EPaper_controller_1.EpaperController.getSingleEpaper);
// Admin-only routes
// router.post(
//   "/",
//   auth(ENUM_USER_ROLE.ADMIN),
//   uploadImage,
//   // validateRequest(EpaperValidation.createEpaperZodSchema),
//   EpaperController.createEpaper
// );
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (req, res, next) => {
    (0, fileHandlers_1.uploadEpaperFiles)(req, res, (err) => {
        if (err) {
            (0, fileHandlers_1.handleUploadError)(err, req, res, next);
        }
        else {
            next();
        }
    });
}, EPaper_controller_1.EpaperController.createEpaper);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (0, validateRequest_1.default)(EPaper_validation_1.EpaperValidation.updateEpaperZodSchema), EPaper_controller_1.EpaperController.updateEpaper);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), EPaper_controller_1.EpaperController.deleteEpaper);
exports.EpaperRoutes = router;
