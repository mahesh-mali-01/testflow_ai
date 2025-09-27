import mongoose, { Document, Schema } from "mongoose";
import { TestSuite } from "../types";

export interface TestSuiteDocument extends Document {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  testCount: number;
  lastRun?: string;
  status: "active" | "inactive";
  author: string;
}

const TestSuiteSchema = new Schema<TestSuiteDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    testCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastRun: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
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
TestSuiteSchema.index({ name: 1 });
TestSuiteSchema.index({ status: 1 });
TestSuiteSchema.index({ author: 1 });
TestSuiteSchema.index({ createdAt: -1 });

export const TestSuiteModel = mongoose.model<TestSuiteDocument>(
  "TestSuite",
  TestSuiteSchema
);
