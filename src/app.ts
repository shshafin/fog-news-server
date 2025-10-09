import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import modulesRoutes from "./app/routes";
import path from "path";

const app: Application = express();

const allowedOrigins = [
  "https://frontend2.tiresdash.com",
  "http://localhost:3000",
  "https://fog-news-client.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/storage", express.static(path.join(__dirname, "../public/storage")));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/api/v1", modulesRoutes);

//global error handler
app.use(globalErrorHandler);

// handle api not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
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

export default app;
