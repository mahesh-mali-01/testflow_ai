import { Router } from "express";
import testSuiteRoutes from "./testSuiteRoutes";
import testRoutes from "./testRoutes";
import testRunRoutes from "./testRunRoutes";
import dashboardRoutes from "./dashboardRoutes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Test Flow AI Backend is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
router.use("/suites", testSuiteRoutes);
router.use("/tests", testRoutes);
router.use("/runs", testRunRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
