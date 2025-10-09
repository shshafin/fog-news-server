import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { NewsController } from "./news.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";
import { uploadImages } from "../../../helpers/fileHandlers";

const router = express.Router();

router.post(
  "/create",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImages,
  // validateRequest(NewsValidation.createNewsZodSchema),
  NewsController.createNews
);

router.get("/", NewsController.getAllNews);
router.get("/:id", NewsController.getSingleNews);
router.get("/category/:slug", NewsController.getNewsByCategory);

router.patch(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  uploadImages,
  // validateRequest(NewsValidation.updateNewsZodSchema),
  NewsController.updateNews
);

router.delete(
  "/:id",
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.EDITOR,
    ENUM_USER_ROLE.REPORTER
  ),
  NewsController.deleteNews
);

export const NewsRoutes = router;
