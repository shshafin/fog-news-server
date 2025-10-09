import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.get(
  "/",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  UserController.getUsers
);

router.get(
  "/:email",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  UserController.FindSingleUser
);
router.get(
  "/by/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  UserController.FindSingleUserById
);
router.post(
  "/create",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.create
);
router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.updateUser
);
router.patch(
  "/update-password/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.updateUserPassword
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  UserController.deleteUser
);

export const UserRoutes = router;
