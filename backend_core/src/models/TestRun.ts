import mongoose, { Document, Schema } from "mongoose";
import {
  TestRun,
  TestStage,
  TestAction,
  TestScreenshot,
  TestError,
} from "../types";

export interface TestRunDocument extends Document {
  id: string;
  testId: string;
  suiteId: string;
  status: "running" | "passed" | "failed" | "skipped" | "error";
  summary: string;
  executionTimeMs: number;
  startTimestamp: string;
  endTimestamp: string;
  stages: TestStage[];
  logs: string[];
  screenshots: TestScreenshot[];
  error?: TestError;
  author: string;
  createdAt: string;
}

const TestActionSchema = new Schema<TestAction>(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    outcome: {
      type: String,
      enum: ["success", "failure", "pending"],
      required: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const TestStageSchema = new Schema<TestStage>(
  {
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    actions: [TestActionSchema],
    observations: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pass", "fail", "pending", "running"],
      required: true,
    },
  },
  { _id: false }
);

const TestScreenshotSchema = new Schema<TestScreenshot>(
  {
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const TestErrorSchema = new Schema<TestError>(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    stack: {
      type: String,
      trim: true,
    },
    stage: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const TestRunSchema = new Schema<TestRunDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    testId: {
      type: String,
      required: true,
      index: true,
    },
    suiteId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["running", "passed", "failed", "skipped", "error"],
      required: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    executionTimeMs: {
      type: Number,
      required: true,
      min: 0,
    },
    startTimestamp: {
      type: String,
      required: true,
    },
    endTimestamp: {
      type: String,
      required: true,
    },
    stages: [TestStageSchema],
    logs: [
      {
        type: String,
        trim: true,
      },
    ],
    screenshots: [TestScreenshotSchema],
    error: TestErrorSchema,
    author: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better performance
TestRunSchema.index({ testId: 1 });
TestRunSchema.index({ suiteId: 1 });
TestRunSchema.index({ status: 1 });
TestRunSchema.index({ author: 1 });
TestRunSchema.index({ createdAt: -1 });
TestRunSchema.index({ startTimestamp: -1 });

export const TestRunModel = mongoose.model<TestRunDocument>(
  "TestRun",
  TestRunSchema
);
