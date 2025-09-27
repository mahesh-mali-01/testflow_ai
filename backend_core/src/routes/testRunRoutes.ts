import { Router } from "express";
import {
  getTestRuns,
  getTestRun,
  createTestRun,
  updateTestRun,
  deleteTestRun,
  getTestRunStats,
} from "../controllers/testRunController";
import {
  validateRequest,
  validateQuery,
  validateParams,
} from "../middleware/validation";
import { queryParamsSchema, idParamSchema } from "../middleware/schemas";

const router = Router();

// GET /api/v1/runs - Get all test runs
router.get("/", validateQuery(queryParamsSchema), getTestRuns);

// GET /api/v1/runs/stats - Get test run statistics
router.get("/stats", getTestRunStats);

// GET /api/v1/runs/:id - Get single test run
router.get("/:id", validateParams(idParamSchema), getTestRun);

// POST /api/v1/runs - Create new test run
router.post("/", createTestRun);

// PUT /api/v1/runs/:id - Update test run
router.put("/:id", validateParams(idParamSchema), updateTestRun);

// DELETE /api/v1/runs/:id - Delete test run
router.delete("/:id", validateParams(idParamSchema), deleteTestRun);

export default router;
