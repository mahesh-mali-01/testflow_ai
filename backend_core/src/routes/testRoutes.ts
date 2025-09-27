import { Router } from "express";
import {
  getTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  executeTest,
} from "../controllers/testController";
import {
  validateRequest,
  validateQuery,
  validateParams,
} from "../middleware/validation";
import {
  createTestSchema,
  updateTestSchema,
  executeTestSchema,
  queryParamsSchema,
  idParamSchema,
} from "../middleware/schemas";

const router = Router();

// GET /api/v1/tests - Get all tests
router.get("/", validateQuery(queryParamsSchema), getTests);

// GET /api/v1/tests/:id - Get single test
router.get("/:id", validateParams(idParamSchema), getTest);

// POST /api/v1/tests - Create new test
router.post("/", validateRequest(createTestSchema), createTest);

// PUT /api/v1/tests/:id - Update test
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateRequest(updateTestSchema),
  updateTest
);

// DELETE /api/v1/tests/:id - Delete test
router.delete("/:id", validateParams(idParamSchema), deleteTest);

// POST /api/v1/tests/:id/execute - Execute test
router.post(
  "/:id/execute",
  validateParams(idParamSchema),
  validateRequest(executeTestSchema),
  executeTest
);

export default router;
