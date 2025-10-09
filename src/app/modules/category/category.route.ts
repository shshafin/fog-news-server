import express from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";
import { ENUM_USER_ROLE } from "../../../enum/user";
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
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory
);

router.get("/:id", CategoryController.getSingleCategory);

router.get("/", CategoryController.getAllCategories);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImage,
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;
