"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntertainmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const entertainment_controller_1 = require("./entertainment.controller");
const entertainment_validation_1 = require("./entertainment.validation");
const user_1 = require("../../../enum/user");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (req, res, next) => {
    (0, fileHandlers_1.uploadEntertainmentFiles)(req, res, (err) => {
        if (err) {
            (0, fileHandlers_1.handleUploadError)(err, req, res, next);
        }
        else {
            next();
        }
    });
}, (0, validateRequest_1.default)(entertainment_validation_1.EntertainmentValidation.createEntertainmentZodSchema), entertainment_controller_1.EntertainmentController.createEntertainment);
router.get("/:id", entertainment_controller_1.EntertainmentController.getSingleEntertainment);
router.get("/", entertainment_controller_1.EntertainmentController.getAllEntertainments);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (req, res, next) => {
    (0, fileHandlers_1.uploadEntertainmentFiles)(req, res, (err) => {
        if (err) {
            (0, fileHandlers_1.handleUploadError)(err, req, res, next);
        }
        else {
            next();
        }
    });
}, (0, validateRequest_1.default)(entertainment_validation_1.EntertainmentValidation.updateEntertainmentZodSchema), entertainment_controller_1.EntertainmentController.updateEntertainment);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), entertainment_controller_1.EntertainmentController.deleteEntertainment);
exports.EntertainmentRoutes = router;
