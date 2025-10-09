import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadFiles } from "../../../helpers/fileHandlers";
import { SiteSettingsValidation } from "./settings.validation";
import { SiteSettingsController } from "./settings.controller";

const router = express.Router();

router.post(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadFiles,
  validateRequest(SiteSettingsValidation.createSiteSettingsZodSchema),
  SiteSettingsController.createOrUpdateSettings
);

router.get("/", SiteSettingsController.getSettings);

export const SiteSettingsRoutes = router;
