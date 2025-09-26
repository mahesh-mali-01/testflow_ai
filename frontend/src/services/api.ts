// API service for Test Flow AI Backend integration

const API_BASE_URL = "http://localhost:3001/api/v1";

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

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiRequest<{
      totalSuites: number;
      totalTests: number;
      totalRuns: number;
      passedRuns: number;
      failedRuns: number;
      runningTests: number;
      successRate: number;
    }>("/dashboard/stats"),

  getRecentRuns: (limit = 10) =>
    apiRequest<any[]>(`/dashboard/recent-runs?limit=${limit}`),

  getTrends: (days = 7) => apiRequest<any[]>(`/dashboard/trends?days=${days}`),
};

// Test Suites API
export const testSuitesApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(
      `/suites${query ? `?${query}` : ""}`
    );
  },

  getById: (id: string) => apiRequest<any>(`/suites/${id}`),

  create: (data: { name: string; description?: string }) =>
    apiRequest<any>("/suites", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: { name?: string; description?: string; status?: string }
  ) =>
    apiRequest<any>(`/suites/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`/suites/${id}`, {
      method: "DELETE",
    }),

  getTests: (
    suiteId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      priority?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);

    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(
      `/suites/${suiteId}/tests${query ? `?${query}` : ""}`
    );
  },
};

// Tests API
export const testsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    suiteId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.suiteId) queryParams.append("suiteId", params.suiteId);

    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(
      `/tests${query ? `?${query}` : ""}`
    );
  },

  getById: (id: string) => apiRequest<any>(`/tests/${id}`),

  create: (data: {
    suiteId: string;
    name: string;
    tags: string[];
    priority: "low" | "medium" | "high" | "critical";
    appUrl: string;
    browser: "chrome" | "firefox" | "safari" | "edge";
    timeout: number;
    preconditions: string[];
    feature: string;
    scenarios: Array<{
      name: string;
      steps: Array<{
        type: "Given" | "When" | "Then" | "And" | "But";
        description: string;
      }>;
    }>;
  }) =>
    apiRequest<any>("/tests", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`/tests/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`/tests/${id}`, {
      method: "DELETE",
    }),

  execute: (
    id: string,
    options?: {
      headless?: boolean;
      timeout?: number;
      browser?: string;
    }
  ) =>
    apiRequest<any>(`/tests/${id}/execute`, {
      method: "POST",
      body: JSON.stringify({ options }),
    }),
};

// Test Runs API
export const testRunsApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    testId?: string;
    suiteId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.testId) queryParams.append("testId", params.testId);
    if (params?.suiteId) queryParams.append("suiteId", params.suiteId);

    const query = queryParams.toString();
    return apiRequest<PaginatedResponse<any>>(
      `/runs${query ? `?${query}` : ""}`
    );
  },

  getById: (id: string) => apiRequest<any>(`/runs/${id}`),

  create: (data: { testId: string; suiteId?: string }) =>
    apiRequest<any>("/runs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`/runs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<any>(`/runs/${id}`, {
      method: "DELETE",
    }),

  getStats: (params?: { testId?: string; suiteId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.testId) queryParams.append("testId", params.testId);
    if (params?.suiteId) queryParams.append("suiteId", params.suiteId);

    const query = queryParams.toString();
    return apiRequest<{
      totalRuns: number;
      passedRuns: number;
      failedRuns: number;
      runningRuns: number;
      successRate: number;
    }>(`/runs/stats${query ? `?${query}` : ""}`);
  },
};

// Health check
export const healthApi = {
  check: () => apiRequest<any>("/health"),
};
