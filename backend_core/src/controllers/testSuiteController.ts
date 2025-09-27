import { Request, Response, NextFunction } from "express";
import { TestSuiteModel } from "../models/TestSuite";
import { TestModel } from "../models/Test";
import {
  ApiResponse,
  PaginatedResponse,
  CreateTestSuiteRequest,
  UpdateTestSuiteRequest,
  QueryParams,
} from "../types";
import { v4 as uuidv4 } from "uuid";

// Get all test suites with pagination and filtering
export const getTestSuites = async (
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
    } = req.query as QueryParams;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      filter.status = status;
    }

    const [suites, total] = await Promise.all([
      TestSuiteModel.find(filter)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      TestSuiteModel.countDocuments(filter),
    ]);

    // Update test counts for each suite
    const suitesWithCounts = await Promise.all(
      suites.map(async (suite) => {
        const testCount = await TestModel.countDocuments({ suiteId: suite.id });
        return { ...suite, testCount };
      })
    );

    const response: PaginatedResponse<any> = {
      data: suitesWithCounts,
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

// Get single test suite by ID
export const getTestSuite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const suite = await TestSuiteModel.findOne({ id }).lean();
    if (!suite) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test suite not found",
      };
      res.status(404).json(response);
      return;
    }

    // Get test count
    const testCount = await TestModel.countDocuments({ suiteId: suite.id });

    res.json({
      success: true,
      data: { ...suite, testCount },
    });
  } catch (error) {
    next(error);
  }
};

// Create new test suite
export const createTestSuite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description }: CreateTestSuiteRequest = req.body;
    const author = "mahesh.mali@flytbase.com"; // TODO: Get from auth middleware

    const suite = new TestSuiteModel({
      id: uuidv4(),
      name,
      description,
      testCount: 0,
      status: "active",
      author,
    });

    await suite.save();

    res.status(201).json({
      success: true,
      data: suite,
      message: "Test suite created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update test suite
export const updateTestSuite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateTestSuiteRequest = req.body;

    const suite = await TestSuiteModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date().toISOString() },
      { new: true, runValidators: true }
    );

    if (!suite) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test suite not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({
      success: true,
      data: suite,
      message: "Test suite updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete test suite
export const deleteTestSuite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if suite has tests
    const testCount = await TestModel.countDocuments({ suiteId: id });
    if (testCount > 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Cannot delete test suite with existing tests",
      };
      res.status(400).json(response);
      return;
    }

    const suite = await TestSuiteModel.findOneAndDelete({ id });
    if (!suite) {
      const response: ApiResponse<null> = {
        success: false,
        message: "Test suite not found",
      };
      res.status(404).json(response);
      return;
    }

    res.json({
      success: true,
      message: "Test suite deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get tests in a suite
export const getSuiteTests = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      search = "",
      status = "",
      priority = "",
      tags = "",
    } = req.query as QueryParams;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build filter object
    const filter: any = { suiteId: id };
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
