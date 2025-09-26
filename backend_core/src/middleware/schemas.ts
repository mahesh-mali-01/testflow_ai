import Joi from "joi";

// Test Suite Validation Schemas
export const createTestSuiteSchema = Joi.object({
  name: Joi.string().required().trim().max(100),
  description: Joi.string().optional().trim().max(500),
});

export const updateTestSuiteSchema = Joi.object({
  name: Joi.string().optional().trim().max(100),
  description: Joi.string().optional().trim().max(500),
  status: Joi.string().valid("active", "inactive").optional(),
});

// Test Validation Schemas
export const createTestSchema = Joi.object({
  suiteId: Joi.string().required(),
  name: Joi.string().required().trim().max(200),
  tags: Joi.array().items(Joi.string().trim()).optional().default([]),
  priority: Joi.string()
    .valid("low", "medium", "high", "critical")
    .optional()
    .default("medium"),
  appUrl: Joi.string().required().uri(),
  browser: Joi.string()
    .valid("chrome", "firefox", "safari", "edge")
    .optional()
    .default("chrome"),
  timeout: Joi.number()
    .integer()
    .min(1000)
    .max(300000)
    .optional()
    .default(30000),
  preconditions: Joi.array().items(Joi.string().trim()).optional().default([]),
  feature: Joi.string().required().trim(),
  scenarios: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().trim(),
        steps: Joi.array()
          .items(
            Joi.object({
              type: Joi.string()
                .valid("Given", "When", "Then", "And", "But")
                .required(),
              description: Joi.string().required().trim(),
            })
          )
          .required(),
      })
    )
    .required(),
});

export const updateTestSchema = Joi.object({
  name: Joi.string().optional().trim().max(200),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  priority: Joi.string().valid("low", "medium", "high", "critical").optional(),
  appUrl: Joi.string().optional().uri(),
  browser: Joi.string().valid("chrome", "firefox", "safari", "edge").optional(),
  timeout: Joi.number().integer().min(1000).max(300000).optional(),
  preconditions: Joi.array().items(Joi.string().trim()).optional(),
  feature: Joi.string().optional().trim(),
  scenarios: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().trim(),
        steps: Joi.array()
          .items(
            Joi.object({
              type: Joi.string()
                .valid("Given", "When", "Then", "And", "But")
                .required(),
              description: Joi.string().required().trim(),
            })
          )
          .required(),
      })
    )
    .optional(),
  status: Joi.string()
    .valid("draft", "ready", "running", "passed", "failed")
    .optional(),
});

// Test Execution Schema
export const executeTestSchema = Joi.object({
  testId: Joi.string().required(),
  options: Joi.object({
    headless: Joi.boolean().optional(),
    timeout: Joi.number().integer().min(1000).max(300000).optional(),
    browser: Joi.string()
      .valid("chrome", "firefox", "safari", "edge")
      .optional(),
  }).optional(),
});

// Query Parameter Schemas
export const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  sort: Joi.string().optional(),
  order: Joi.string().valid("asc", "desc").optional().default("desc"),
  search: Joi.string().optional(),
  status: Joi.string().optional(),
  priority: Joi.string().valid("low", "medium", "high", "critical").optional(),
  tags: Joi.string().optional(),
});

// ID Parameter Schema
export const idParamSchema = Joi.object({
  id: Joi.string().required(),
});
