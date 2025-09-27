import { Request, Response, NextFunction } from "express";
import { TestRunModel } from "../models/TestRun";
import { TestModel } from "../models/Test";
import { ApiResponse, PaginatedResponse, QueryParams } from "../types";
import { v4 as uuidv4 } from "uuid";

// Get all test runs with pagination and filtering
export const getTestRuns = async (
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
      testId = "",
      suiteId = "",
    } = req.query as QueryParams;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = {};
    if (search) {
      filter.$or = [
        { summary: { $regex: search, $options: "i" } },
        { testId: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      filter.status = status;
    }
    if (testId) {
      filter.testId = testId;
    }
    if (suiteId) {
      filter.suiteId = suiteId;
    }

    const [runs, total] = await Promise.all([
      TestRunModel.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      TestRunModel.countDocuments(filter),
    ]);

    const response: PaginatedResponse<any> = {
      data: runs,
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

// Get single test run by ID
export const getTestRun = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const run = await TestRunModel.findOne({ id }).lean();
    if (!run) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test run not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({
      success: true,
      data: run,
    });
  } catch (error) {
    next(error);
  }
};

// Create test run (usually called internally during test execution)
export const createTestRun = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { testId, suiteId, options = {} } = req.body;
    const author = "mahesh.mali@flytbase.com"; // TODO: Get from auth middleware

    // Verify test exists
    const test = await TestModel.findOne({ id: testId });
    if (!test) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test not found",
      };
      res.status(404).json(response);
      return;
    }

    const run = new TestRunModel({
      id: uuidv4(),
      testId,
      suiteId: suiteId || test.suiteId,
      status: "running",
      summary: "Test execution started",
      executionTimeMs: 0,
      startTimestamp: new Date().toISOString(),
      endTimestamp: new Date().toISOString(),
      stages: [],
      logs: [
        `${new Date().toISOString()}: Test execution started for ${test.name}`,
      ],
      screenshots: [],
      author,
    });

    await run.save();

    res.status(201).json({
      success: true,
      data: run,
      message: "Test run created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update test run status and results
export const updateTestRun = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const run = await TestRunModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date().toISOString() },
      { new: true, runValidators: true }
    );

    if (!run) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test run not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({
      success: true,
      data: run,
      message: "Test run updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete test run
export const deleteTestRun = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const run = await TestRunModel.findOneAndDelete({ id });
    if (!run) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test run not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({
      success: true,
      message: "Test run deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get test run statistics
export const getTestRunStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { testId, suiteId } = req.query;

    const filter: any = {};
    if (testId) {
      filter.testId = testId;
    }
    if (suiteId) {
      filter.suiteId = suiteId;
    }

    const [totalRuns, passedRuns, failedRuns, runningRuns] = await Promise.all([
      TestRunModel.countDocuments(filter),
      TestRunModel.countDocuments({ ...filter, status: "passed" }),
      TestRunModel.countDocuments({ ...filter, status: "failed" }),
      TestRunModel.countDocuments({ ...filter, status: "running" }),
    ]);

    const successRate =
      totalRuns > 0
        ? parseFloat(((passedRuns / totalRuns) * 100).toFixed(1))
        : 0;

    res.json({
      success: true,
      data: {
        totalRuns,
        passedRuns,
        failedRuns,
        runningRuns,
        successRate,
      },
    });
  } catch (error) {
    next(error);
  }
};
