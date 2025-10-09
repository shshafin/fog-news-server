import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { JobController } from "./job.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { JobValidation } from "./job.validation";
import { uploadImage } from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImage,
  validateRequest(JobValidation.createJobZodSchema),
  JobController.createJob
);

router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getSingleJob);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImage,
  validateRequest(JobValidation.updateJobZodSchema),
  JobController.updateJob
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  JobController.deleteJob
);

export const JobRoutes = router;
