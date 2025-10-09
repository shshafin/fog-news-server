import express from "express";

import auth from "../../middlewares/auth";

import validateRequest from "../../middlewares/validateRequest";
import { EpaperController } from "./EPaper.controller";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { EpaperValidation } from "./EPaper.validation";
import {
  handleUploadError,
  uploadEpaperFiles,
  uploadImage,
} from "../../../helpers/fileHandlers";

const router = express.Router();

// Public routes (read-only)
router.get("/", EpaperController.getAllEpapers);
router.get("/:id", EpaperController.getSingleEpaper);

// Admin-only routes
// router.post(
//   "/",
//   auth(ENUM_USER_ROLE.ADMIN),
//   uploadImage,
//   // validateRequest(EpaperValidation.createEpaperZodSchema),
//   EpaperController.createEpaper
// );

router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  (req, res, next) => {
    uploadEpaperFiles(req, res, (err) => {
      if (err) {
        handleUploadError(err, req, res, next);
      } else {
        next();
      }
    });
  },
  EpaperController.createEpaper
);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(EpaperValidation.updateEpaperZodSchema),
  EpaperController.updateEpaper
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  EpaperController.deleteEpaper
);

export const EpaperRoutes = router;
