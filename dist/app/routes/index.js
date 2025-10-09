"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/users/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const category_route_1 = require("../modules/category/category.route");
const news_route_1 = require("../modules/news/news.route");
const poll_route_1 = require("../modules/poll-news/poll.route");
const comment_route_1 = require("../modules/comment/comment.route");
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
const socialMedia_route_1 = require("../modules/socialMedia/socialMedia.route");
const quiz_route_1 = require("../modules/quiz/quiz.route");
const advertisement_route_1 = require("../modules/advertisement/advertisement.route");
const ePaper_routes_1 = require("../modules/EPaper/ePaper.routes");
const entertainment_route_1 = require("../modules/entertainment/entertainment.route");
const job_routes_1 = require("../modules/job/job.routes");
const job_application_routes_1 = require("../modules/job-application/job-application.routes");
const router = express_1.default.Router();
const modulesRoutes = [
    {
        path: "/users",
        module: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        module: auth_route_1.AuthRoutes,
    },
    {
        path: "/categories",
        module: category_route_1.CategoryRoutes,
    },
    {
        path: "/news",
        module: news_route_1.NewsRoutes,
    },
    {
        path: "/poll",
        module: poll_route_1.PollRoutes,
    },
    {
        path: "/comment",
        module: comment_route_1.CommentRoutes,
    },
    {
        path: "/news-letter",
        module: newsletter_route_1.NewsletterRoutes,
    },
    {
        path: "/video",
        module: socialMedia_route_1.SocialMediaRoutes,
    },
    {
        path: "/quiz",
        module: quiz_route_1.QuizRoutes,
    },
    {
        path: "/advertisement",
        module: advertisement_route_1.AdvertisementRoutes,
    },
    {
        path: "/epaper",
        module: ePaper_routes_1.EpaperRoutes,
    },
    {
        path: "/entertainment",
        module: entertainment_route_1.EntertainmentRoutes,
    },
    {
        path: "/jobs",
        module: job_routes_1.JobRoutes,
    },
    {
        path: "/job-applications",
        module: job_application_routes_1.JobApplicationRoutes,
    },
];
modulesRoutes.forEach((route) => router.use(route.path, route.module));
exports.default = router;
