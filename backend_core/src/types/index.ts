// Test Flow AI - Backend TypeScript Interfaces

export interface TestSuite {
  _id?: string;
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

export interface Test {
  _id?: string;
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
  _id?: string;
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
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateTestSuiteRequest {
  name: string;
  description?: string;
}

export interface UpdateTestSuiteRequest {
  name?: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface CreateTestRequest {
  suiteId: string;
  name: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "critical";
  appUrl: string;
  browser: "chrome" | "firefox" | "safari" | "edge";
  timeout: number;
  preconditions: string[];
  feature: string;
  scenarios: TestScenario[];
}

export interface UpdateTestRequest {
  name?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high" | "critical";
  appUrl?: string;
  browser?: "chrome" | "firefox" | "safari" | "edge";
  timeout?: number;
  preconditions?: string[];
  feature?: string;
  scenarios?: TestScenario[];
  status?: "draft" | "ready" | "running" | "passed" | "failed";
}

export interface ExecuteTestRequest {
  testId: string;
  options?: {
    headless?: boolean;
    timeout?: number;
    browser?: string;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: string;
  priority?: string;
  tags?: string;
  suiteId?: string;
  testId?: string;
}
