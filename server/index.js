import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { logger } from "./utils/logger.js";

const app = express();
const port = 3000;
const isProd = process.env.NODE_ENV === "production";
const host = isProd ? "https://testacode.github.io" : "http://localhost";

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: "Too many requests, please try again later.",
      status: 429,
    },
  },
});

// Security middleware
app.use(helmet());
app.use(limiter);
app.use(
  cors({
    origin: `${host}:5173`,
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(
  express.json({
    limit: "10kb",
    strict: true,
    type: "application/json",
  })
);

// Logging middleware
app.use(requestLogger);

// Routes
app.get("/api/hello", (req, res, next) => {
  try {
    logger.info("Processing /api/hello request");
    res.json({ data: "hello world" });
  } catch (error) {
    next(error);
  }
});

// 404 handler
app.use((req, res) => {
  logger.warn("Route not found", { path: req.path, method: req.method });
  res.status(404).json({
    error: {
      message: "Not Found",
      status: 404,
      path: req.path,
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", { error: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
  process.exit(1);
});

app.listen(port, () => {
  logger.info(`Server started`, { port, environment: process.env.NODE_ENV });
});
