import express from "express";
import { AdvertisementController } from "./advertisement.controller";
import auth from "../../middlewares/auth";

import {
  createAdvertisementSchema,
  updateAdvertisementSchema,
} from "./advertisement.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";
import validateRequest from "../../middlewares/validateRequest";
import { uploadImage } from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImage,
  // validateRequest(createAdvertisementSchema),
  AdvertisementController.createAdvertisement
);

router.get("/", AdvertisementController.getAllAdvertisements);
router.get("/active", AdvertisementController.getActiveAdvertisements);
router.get("/:id", AdvertisementController.getSingleAdvertisement);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImage,
  validateRequest(updateAdvertisementSchema),
  AdvertisementController.updateAdvertisement
);

// Toggle Advertisement Status (Admin only)
router.patch(
  "/:id/toggle-status",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  AdvertisementController.toggleAdvertisementStatus
);

router.get("/count-active", AdvertisementController.countActiveAdvertisements);

router.get(
  "/expired",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  AdvertisementController.getExpiredAdvertisements
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  AdvertisementController.deleteAdvertisement
);

export const AdvertisementRoutes = router;
