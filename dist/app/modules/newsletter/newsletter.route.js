"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const newsletter_controller_1 = require("./newsletter.controller");
const newsletter_validation_1 = require("./newsletter.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const router = express_1.default.Router();
router.post("/subscribe", (0, validateRequest_1.default)(newsletter_validation_1.NewsletterValidation.subscribeEmailZodSchema), newsletter_controller_1.NewsletterController.subscribeEmail);
router.post("/unsubscribe", (0, validateRequest_1.default)(newsletter_validation_1.NewsletterValidation.unsubscribeEmailZodSchema), newsletter_controller_1.NewsletterController.unsubscribeEmail);
router.get("/subscribers", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), newsletter_controller_1.NewsletterController.getAllSubscribers);
router.get("/status/:email", (0, validateRequest_1.default)(newsletter_validation_1.NewsletterValidation.getSubscriptionStatusZodSchema), newsletter_controller_1.NewsletterController.getSubscriptionStatus);
exports.NewsletterRoutes = router;
