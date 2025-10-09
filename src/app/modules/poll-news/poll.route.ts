import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { PollController } from "./poll.controller";
import { PollValidation } from "./poll.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(PollValidation.createPollZodSchema),
  PollController.createPoll
);

router.get("/", PollController.getAllPolls);

router.get("/:id", PollController.getSinglePoll);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(PollValidation.updatePollZodSchema),
  PollController.updatePoll
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  PollController.deletePoll
);

router.patch(
  "/:pollId/vote/:optionId",
  validateRequest(PollValidation.voteForOptionZodSchema),
  PollController.voteForOption
);

export const PollRoutes = router;
