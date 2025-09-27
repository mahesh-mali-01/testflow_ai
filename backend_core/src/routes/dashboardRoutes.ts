import { Router } from "express";
import {
  getDashboardStats,
  getRecentTestRuns,
  getExecutionTrends,
} from "../controllers/dashboardController";

const router = Router();

// GET /api/v1/dashboard/stats - Get dashboard statistics
router.get("/stats", getDashboardStats);

// GET /api/v1/dashboard/recent-runs - Get recent test runs
router.get("/recent-runs", getRecentTestRuns);

// GET /api/v1/dashboard/trends - Get execution trends
router.get("/trends", getExecutionTrends);

export default router;
