// Test Flow AI - TypeScript Interfaces

export interface TestSuite {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  testCount: number;
  lastRun?: string;
  status: "active" | "inactive";
}

export interface Test {
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

export interface TestScenario {
  name: string;
  steps: TestStep[];
}

export interface TestStep {
  type: "Given" | "When" | "Then" | "And" | "But";
  description: string;
}

export interface TestRun {
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
}

export interface TestStage {
  stage: string;
  description: string;
  actions: TestAction[];
  observations: string;
  status: "pass" | "fail" | "pending" | "running";
}

export interface TestAction {
  action: string;
  outcome: "success" | "failure" | "pending";
  details: string;
}

export interface TestScreenshot {
  stage: string;
  url: string;
  timestamp: string;
}

export interface TestError {
  message: string;
  stack?: string;
  stage?: string;
}

export interface DashboardStats {
  totalSuites: number;
  totalTests: number;
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  runningTests: number;
  successRate: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
