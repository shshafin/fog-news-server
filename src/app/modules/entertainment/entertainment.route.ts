import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { EntertainmentController } from "./entertainment.controller";
import { EntertainmentValidation } from "./entertainment.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";
import {
  handleUploadError,
  uploadEntertainmentFiles,
} from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  (req, res, next) => {
    uploadEntertainmentFiles(req, res, (err) => {
      if (err) {
        handleUploadError(err, req, res, next);
      } else {
        next();
      }
    });
  },
  validateRequest(EntertainmentValidation.createEntertainmentZodSchema),
  EntertainmentController.createEntertainment
);

router.get("/:id", EntertainmentController.getSingleEntertainment);
router.get("/", EntertainmentController.getAllEntertainments);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  (req, res, next) => {
    uploadEntertainmentFiles(req, res, (err) => {
      if (err) {
        handleUploadError(err, req, res, next);
      } else {
        next();
      }
    });
  },
  validateRequest(EntertainmentValidation.updateEntertainmentZodSchema),
  EntertainmentController.updateEntertainment
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  EntertainmentController.deleteEntertainment
);

export const EntertainmentRoutes = router;
