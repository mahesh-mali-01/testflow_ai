import { Request, Response, NextFunction } from "express";
import { TestModel } from "../models/Test";
import { TestSuiteModel } from "../models/TestSuite";
import {
  ApiResponse,
  PaginatedResponse,
  CreateTestRequest,
  UpdateTestRequest,
  QueryParams,
} from "../types";
import { v4 as uuidv4 } from "uuid";

// Get all tests with pagination and filtering
export const getTests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      search = "",
      status = "",
      priority = "",
      tags = "",
      suiteId = "",
    } = req.query as QueryParams;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { feature: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }
    if (suiteId) {
      filter.suiteId = suiteId;
    }

    const [tests, total] = await Promise.all([
      TestModel.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      TestModel.countDocuments(filter),
    ]);

    const response: PaginatedResponse<any> = {
      data: tests,
      total,
      page: Number(page),
      limit: Number(limit),
      hasNext: skip + Number(limit) < total,
      hasPrev: Number(page) > 1,
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

// Get single test by ID
export const getTest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const test = await TestModel.findOne({ id }).lean();
    if (!test) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({
      success: true,
      data: test,
    });
  } catch (error) {
    next(error);
  }
};

// Create new test
export const createTest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const testData: CreateTestRequest = req.body;
    const author = "mahesh.mali@flytbase.com"; // TODO: Get from auth middleware

    // Verify suite exists
    const suite = await TestSuiteModel.findOne({ id: testData.suiteId });
    if (!suite) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test suite not found",
      };
      res.status(404).json(response);
      return;
    }

    const test = new TestModel({
      id: uuidv4(),
      testId: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      suiteId: testData.suiteId,
      name: testData.name,
      tags: testData.tags || [],
      priority: testData.priority || "medium",
      author,
      appUrl: testData.appUrl,
      browser: testData.browser || "chrome",
      timeout: testData.timeout || 30000,
      preconditions: testData.preconditions || [],
      feature: testData.feature,
      scenarios: testData.scenarios,
      status: "draft",
    });

    await test.save();

    // Update suite test count
    await TestSuiteModel.findOneAndUpdate(
      { id: testData.suiteId },
      { $inc: { testCount: 1 } }
    );

    res.status(201).json({
      success: true,
      data: test,
      message: "Test created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update test
export const updateTest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateTestRequest = req.body;

    const test = await TestModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date().toISOString() },
      { new: true, runValidators: true }
    );

    if (!test) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({
      success: true,
      data: test,
      message: "Test updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete test
export const deleteTest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const test = await TestModel.findOneAndDelete({ id });
    if (!test) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test not found",
      };
      res.status(404).json(response);
      return;
    }

    // Update suite test count
    await TestSuiteModel.findOneAndUpdate(
      { id: test.suiteId },
      { $inc: { testCount: -1 } }
    );

    res.json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Execute test
export const executeTest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { options = {} } = req.body;

    const test = await TestModel.findOne({ id });
    if (!test) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test not found",
      };
      res.status(404).json(response);
      return;
    }

    // Update test status to running
    await TestModel.findOneAndUpdate(
      { id },
      { status: "running", lastRun: new Date().toISOString() }
    );

    // TODO: Implement actual test execution logic
    // This would integrate with Browser Use or similar automation tools
    // For now, we'll simulate execution

    // Simulate test execution (replace with actual execution logic)
    setTimeout(async () => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      await TestModel.findOneAndUpdate(
        { id },
        {
          status: success ? "passed" : "failed",
          lastRun: new Date().toISOString(),
        }
      );
    }, 5000); // 5 second simulation

    res.json({
      success: true,
      message: "Test execution started",
      data: {
        testId: test.id,
        status: "running",
        estimatedDuration: "30-60 seconds",
      },
    });
  } catch (error) {
    next(error);
  }
};
