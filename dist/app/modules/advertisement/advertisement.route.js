"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertisementRoutes = void 0;
const express_1 = __importDefault(require("express"));
const advertisement_controller_1 = require("./advertisement.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const advertisement_validation_1 = require("./advertisement.validation");
const user_1 = require("../../../enum/user");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), fileHandlers_1.uploadImage, 
// validateRequest(createAdvertisementSchema),
advertisement_controller_1.AdvertisementController.createAdvertisement);
router.get("/", advertisement_controller_1.AdvertisementController.getAllAdvertisements);
router.get("/active", advertisement_controller_1.AdvertisementController.getActiveAdvertisements);
router.get("/:id", advertisement_controller_1.AdvertisementController.getSingleAdvertisement);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), fileHandlers_1.uploadImage, (0, validateRequest_1.default)(advertisement_validation_1.updateAdvertisementSchema), advertisement_controller_1.AdvertisementController.updateAdvertisement);
// Toggle Advertisement Status (Admin only)
router.patch("/:id/toggle-status", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), advertisement_controller_1.AdvertisementController.toggleAdvertisementStatus);
router.get("/count-active", advertisement_controller_1.AdvertisementController.countActiveAdvertisements);
router.get("/expired", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), advertisement_controller_1.AdvertisementController.getExpiredAdvertisements);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), advertisement_controller_1.AdvertisementController.deleteAdvertisement);
exports.AdvertisementRoutes = router;
