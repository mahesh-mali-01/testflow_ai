import { Router } from "express";
import {
  getTestSuites,
  getTestSuite,
  createTestSuite,
  updateTestSuite,
  deleteTestSuite,
  getSuiteTests,
} from "../controllers/testSuiteController";
import {
  validateRequest,
  validateQuery,
  validateParams,
} from "../middleware/validation";
import {
  createTestSuiteSchema,
  updateTestSuiteSchema,
  queryParamsSchema,
  idParamSchema,
} from "../middleware/schemas";

const router = Router();

// GET /api/v1/suites - Get all test suites
router.get("/", validateQuery(queryParamsSchema), getTestSuites);

// GET /api/v1/suites/:id - Get single test suite
router.get("/:id", validateParams(idParamSchema), getTestSuite);

// POST /api/v1/suites - Create new test suite
router.post("/", validateRequest(createTestSuiteSchema), createTestSuite);

// PUT /api/v1/suites/:id - Update test suite
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateRequest(updateTestSuiteSchema),
  updateTestSuite
);

// DELETE /api/v1/suites/:id - Delete test suite
router.delete("/:id", validateParams(idParamSchema), deleteTestSuite);

// GET /api/v1/suites/:id/tests - Get tests in a suite
router.get(
  "/:id/tests",
  validateParams(idParamSchema),
  validateQuery(queryParamsSchema),
  getSuiteTests
);

export default router;
