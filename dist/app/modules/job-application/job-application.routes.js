"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const job_application_controller_1 = require("./job-application.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enum/user");
const fileHandlers_1 = require("../../../helpers/fileHandlers");
const job_application_validation_1 = require("./job-application.validation");
const router = express_1.default.Router();
router.post("/", fileHandlers_1.uploadResume, (0, validateRequest_1.default)(job_application_validation_1.JobApplicationValidation.createJobApplicationZodSchema), job_application_controller_1.JobApplicationController.createJobApplication);
// Admin route to retry failed emails
router.post("/retry-failed-emails", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), job_application_controller_1.JobApplicationController.retryFailedEmails);
router.get("/", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), job_application_controller_1.JobApplicationController.getAllJobApplications);
router.get("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), job_application_controller_1.JobApplicationController.getSingleJobApplication);
router.get("/job/:jobId", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), job_application_controller_1.JobApplicationController.getApplicationsByJob);
router.get("/email/:email", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), job_application_controller_1.JobApplicationController.getApplicationsByEmail);
router.patch("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (0, validateRequest_1.default)(job_application_validation_1.JobApplicationValidation.updateJobApplicationZodSchema), job_application_controller_1.JobApplicationController.updateJobApplication);
router.patch("/:id/status", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), (0, validateRequest_1.default)(job_application_validation_1.JobApplicationValidation.updateApplicationStatusZodSchema), job_application_controller_1.JobApplicationController.updateApplicationStatus);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.EDITOR, user_1.ENUM_USER_ROLE.REPORTER), job_application_controller_1.JobApplicationController.deleteJobApplication);
exports.JobApplicationRoutes = router;
