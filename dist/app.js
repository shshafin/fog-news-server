"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "https://frontend2.tiresdash.com",
    "http://localhost:3000",
    "https://fog-news-client.vercel.app",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/storage", express_1.default.static(path_1.default.join(__dirname, "../public/storage")));
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.use("/api/v1", routes_1.default);
//global error handler
app.use(globalErrorHandler_1.default);
// handle api not found
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "API not found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API not found",
            },
        ],
    });
    next();
});
exports.default = app;
