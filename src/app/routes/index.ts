import express from "express";

import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { NewsRoutes } from "../modules/news/news.route";
import { PollRoutes } from "../modules/poll-news/poll.route";
import { CommentRoutes } from "../modules/comment/comment.route";
import { NewsletterRoutes } from "../modules/newsletter/newsletter.route";
import { SocialMediaRoutes } from "../modules/socialMedia/socialMedia.route";
import { QuizRoutes } from "../modules/quiz/quiz.route";
import { AdvertisementRoutes } from "../modules/advertisement/advertisement.route";
import { EpaperRoutes } from "../modules/EPaper/ePaper.routes";
import { EntertainmentRoutes } from "../modules/entertainment/entertainment.route";
import { JobRoutes } from "../modules/job/job.routes";
import { JobApplicationRoutes } from "../modules/job-application/job-application.routes";

const router = express.Router();

const modulesRoutes = [
  {
    path: "/users",
    module: UserRoutes,
  },
  {
    path: "/auth",
    module: AuthRoutes,
  },
  {
    path: "/categories",
    module: CategoryRoutes,
  },
  {
    path: "/news",
    module: NewsRoutes,
  },
  {
    path: "/poll",
    module: PollRoutes,
  },
  {
    path: "/comment",
    module: CommentRoutes,
  },
  {
    path: "/news-letter",
    module: NewsletterRoutes,
  },
  {
    path: "/video",
    module: SocialMediaRoutes,
  },
  {
    path: "/quiz",
    module: QuizRoutes,
  },
  {
    path: "/advertisement",
    module: AdvertisementRoutes,
  },
  {
    path: "/epaper",
    module: EpaperRoutes,
  },
  {
    path: "/entertainment",
    module: EntertainmentRoutes,
  },
  {
    path: "/jobs",
    module: JobRoutes,
  },
  {
    path: "/job-applications",
    module: JobApplicationRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.module));
export default router;
