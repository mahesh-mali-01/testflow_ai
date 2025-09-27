import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./utils/database";
import { errorHandler, notFound } from "./middleware/errorHandler";
import routes from "./routes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_PREFIX = process.env.API_PREFIX || "/api";
const API_VERSION = process.env.API_VERSION || "v1";

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use(`${API_PREFIX}/${API_VERSION}`, routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Test Flow AI Backend API",
    version: "1.0.0",
    documentation: `${req.protocol}://${req.get(
      "host"
    )}${API_PREFIX}/${API_VERSION}/health`,
    endpoints: {
      suites: `${API_PREFIX}/${API_VERSION}/suites`,
      tests: `${API_PREFIX}/${API_VERSION}/tests`,
      runs: `${API_PREFIX}/${API_VERSION}/runs`,
      dashboard: `${API_PREFIX}/${API_VERSION}/dashboard`,
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Test Flow AI Backend running on port ${PORT}`);
      console.log(
        `📊 API available at http://localhost:${PORT}${API_PREFIX}/${API_VERSION}`
      );
      console.log(
        `🔍 Health check: http://localhost:${PORT}${API_PREFIX}/${API_VERSION}/health`
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Start the server
startServer();

export default app;
