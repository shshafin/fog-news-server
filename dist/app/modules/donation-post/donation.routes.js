"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const donation_controller_1 = require("./donation.controller");
const donation_validation_1 = require("./donation.validation");
const user_1 = require("../../../enum/user");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const router = express_1.default.Router();
// Admin routes
router.post("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), fileHandlers_1.uploadImage, (0, validateRequest_1.default)(donation_validation_1.DonationValidation.createDonationZodSchema), donation_controller_1.DonationController.createDonation);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), fileHandlers_1.uploadImage, (0, validateRequest_1.default)(donation_validation_1.DonationValidation.updateDonationZodSchema), donation_controller_1.DonationController.updateDonation);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), donation_controller_1.DonationController.deleteDonation);
// Public routes
router.get("/", donation_controller_1.DonationController.getAllDonations);
router.get("/:id", donation_controller_1.DonationController.getSingleDonation);
router.get("/slug/:slug", donation_controller_1.DonationController.getDonationBySlug);
// Donation transaction routes
router.post("/:id/transactions", (0, validateRequest_1.default)(donation_validation_1.DonationValidation.addDonationTransactionZodSchema), donation_controller_1.DonationController.addDonationTransaction);
router.post("/:donationId/transactions/:transactionId/callback", donation_controller_1.DonationController.handlePaymentCallback);
exports.DonationRoutes = router;
