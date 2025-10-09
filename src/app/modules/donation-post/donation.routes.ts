import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DonationController } from "./donation.controller";
import { DonationValidation } from "./donation.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadImage } from "../../../helpers/fileHandlers";

const router = express.Router();

// Admin routes
router.post(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImage,
  validateRequest(DonationValidation.createDonationZodSchema),
  DonationController.createDonation
);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImage,
  validateRequest(DonationValidation.updateDonationZodSchema),
  DonationController.updateDonation
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  DonationController.deleteDonation
);

// Public routes
router.get("/", DonationController.getAllDonations);
router.get("/:id", DonationController.getSingleDonation);
router.get("/slug/:slug", DonationController.getDonationBySlug);

// Donation transaction routes
router.post(
  "/:id/transactions",
  validateRequest(DonationValidation.addDonationTransactionZodSchema),
  DonationController.addDonationTransaction
);

router.post(
  "/:donationId/transactions/:transactionId/callback",
  DonationController.handlePaymentCallback
);

export const DonationRoutes = router;
