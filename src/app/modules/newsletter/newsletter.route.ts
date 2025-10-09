import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { NewsletterController } from "./newsletter.controller";
import { NewsletterValidation } from "./newsletter.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/subscribe",
  validateRequest(NewsletterValidation.subscribeEmailZodSchema),
  NewsletterController.subscribeEmail
);

router.post(
  "/unsubscribe",
  validateRequest(NewsletterValidation.unsubscribeEmailZodSchema),
  NewsletterController.unsubscribeEmail
);

router.get(
  "/subscribers",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  NewsletterController.getAllSubscribers
);

router.get(
  "/status/:email",
  validateRequest(NewsletterValidation.getSubscriptionStatusZodSchema),
  NewsletterController.getSubscriptionStatus
);

export const NewsletterRoutes = router;
