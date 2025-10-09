import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { JobApplicationController } from "./job-application.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

import { uploadResume } from "../../../helpers/fileHandlers";
import { JobApplicationValidation } from "./job-application.validation";

const router = express.Router();

router.post(
  "/",
  uploadResume,
  validateRequest(JobApplicationValidation.createJobApplicationZodSchema),
  JobApplicationController.createJobApplication
);

// Admin route to retry failed emails
router.post(
  "/retry-failed-emails",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  JobApplicationController.retryFailedEmails
);

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  JobApplicationController.getAllJobApplications
);

router.get(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  JobApplicationController.getSingleJobApplication
);

router.get(
  "/job/:jobId",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  JobApplicationController.getApplicationsByJob
);

router.get(
  "/email/:email",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  JobApplicationController.getApplicationsByEmail
);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(JobApplicationValidation.updateJobApplicationZodSchema),
  JobApplicationController.updateJobApplication
);

router.patch(
  "/:id/status",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(JobApplicationValidation.updateApplicationStatusZodSchema),
  JobApplicationController.updateApplicationStatus
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  JobApplicationController.deleteJobApplication
);

export const JobApplicationRoutes = router;
