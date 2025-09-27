import mongoose, { Document, Schema } from "mongoose";
import { Test, TestScenario, TestStep } from "../types";

export interface TestDocument extends Document {
  id: string;
  testId: string;
  suiteId: string;
  name: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "critical";
  author: string;
  createdAt: string;
  appUrl: string;
  browser: "chrome" | "firefox" | "safari" | "edge";
  timeout: number;
  preconditions: string[];
  feature: string;
  scenarios: TestScenario[];
  status: "draft" | "ready" | "running" | "passed" | "failed";
  lastRun?: string;
}

const TestStepSchema = new Schema<TestStep>(
  {
    type: {
      type: String,
      enum: ["Given", "When", "Then", "And", "But"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const TestScenarioSchema = new Schema<TestScenario>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    steps: [TestStepSchema],
  },
  { _id: false }
);

const TestSchema = new Schema<TestDocument>(
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
      unique: true,
      index: true,
    },
    suiteId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    appUrl: {
      type: String,
      required: true,
      trim: true,
    },
    browser: {
      type: String,
      enum: ["chrome", "firefox", "safari", "edge"],
      default: "chrome",
    },
    timeout: {
      type: Number,
      default: 30000,
      min: 1000,
      max: 300000,
    },
    preconditions: [
      {
        type: String,
        trim: true,
      },
    ],
    feature: {
      type: String,
      required: true,
      trim: true,
    },
    scenarios: [TestScenarioSchema],
    status: {
      type: String,
      enum: ["draft", "ready", "running", "passed", "failed"],
      default: "draft",
    },
    lastRun: {
      type: String,
      default: null,
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
TestSchema.index({ suiteId: 1 });
TestSchema.index({ testId: 1 });
TestSchema.index({ name: 1 });
TestSchema.index({ tags: 1 });
TestSchema.index({ priority: 1 });
TestSchema.index({ status: 1 });
TestSchema.index({ author: 1 });
TestSchema.index({ createdAt: -1 });

export const TestModel = mongoose.model<TestDocument>("Test", TestSchema);
