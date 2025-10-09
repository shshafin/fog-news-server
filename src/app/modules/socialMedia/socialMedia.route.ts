import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { SocialMediaController } from "./socialMedia.controller";
import { SocialMediaValidation } from "./socialMedia.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(SocialMediaValidation.createSocialMediaZodSchema),
  SocialMediaController.createSocialMedia
);

router.get("/", SocialMediaController.getAllSocialMedia);

router.get("/:id", SocialMediaController.getSingleSocialMedia);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(SocialMediaValidation.updateSocialMediaZodSchema),
  SocialMediaController.updateSocialMedia
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  SocialMediaController.deleteSocialMedia
);

// router.patch("/toggle-status/:id", SocialMediaController.toggleActiveStatus);

export const SocialMediaRoutes = router;
