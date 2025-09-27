import { Request, Response, NextFunction } from "express";
import { TestSuiteModel } from "../models/TestSuite";
import { TestModel } from "../models/Test";
import { TestRunModel } from "../models/TestRun";
import { ApiResponse, DashboardStats } from "../types";

// Get dashboard statistics
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalSuites,
      totalTests,
      totalRuns,
      passedRuns,
      failedRuns,
      runningTests,
    ] = await Promise.all([
      TestSuiteModel.countDocuments({ status: "active" }),
      TestModel.countDocuments(),
      TestRunModel.countDocuments(),
      TestRunModel.countDocuments({ status: "passed" }),
      TestRunModel.countDocuments({ status: "failed" }),
      TestModel.countDocuments({ status: "running" }),
    ]);

    const successRate = totalRuns > 0 ? (passedRuns / totalRuns) * 100 : 0;

    const stats: DashboardStats = {
      totalSuites,
      totalTests,
      totalRuns,
      passedRuns,
      failedRuns,
      runningTests,
      successRate: parseFloat(successRate.toFixed(1)),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Get recent test runs
export const getRecentTestRuns = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const recentRuns = await TestRunModel.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("testId", "name testId")
      .lean();

    res.json({
      success: true,
      data: recentRuns,
    });
  } catch (error) {
    next(error);
  }
};

// Get test execution trends
export const getExecutionTrends = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const trends = await TestRunModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
          total: { $sum: "$count" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};
