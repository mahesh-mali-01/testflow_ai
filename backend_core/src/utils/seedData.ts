import { v4 as uuidv4 } from "uuid";
import { TestSuiteModel } from "../models/TestSuite";
import { TestModel } from "../models/Test";
import { TestRunModel } from "../models/TestRun";

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await TestRunModel.deleteMany({});
    await TestModel.deleteMany({});
    await TestSuiteModel.deleteMany({});

    // Create test suites
    const testSuites = [
      {
        id: uuidv4(),
        name: "Authentication Suite",
        description:
          "Tests for user authentication flows including login, logout, and password reset",
        status: "active",
        author: "system@testflow.ai",
      },
      {
        id: uuidv4(),
        name: "API Integration Suite",
        description: "Tests for API key generation and management",
        status: "active",
        author: "system@testflow.ai",
      },
      {
        id: uuidv4(),
        name: "User Management Suite",
        description: "Tests for user registration and profile management",
        status: "active",
        author: "system@testflow.ai",
      },
      {
        id: uuidv4(),
        name: "E-commerce Suite",
        description: "Tests for shopping cart and checkout flows",
        status: "active",
        author: "system@testflow.ai",
      },
    ];

    const createdSuites = await TestSuiteModel.insertMany(testSuites);
    console.log(`✅ Created ${createdSuites.length} test suites`);

    // Create tests for each suite
    const tests = [
      // Authentication Suite Tests
      {
        id: uuidv4(),
        testId: uuidv4(),
        suiteId: createdSuites[0]._id,
        name: "Valid Login Test",
        tags: ["authentication", "login", "smoke"],
        priority: "high",
        appUrl: "https://app.testflow.ai",
        browser: "chrome",
        timeout: 30000,
        preconditions: ["User account exists", "Application is accessible"],
        feature: "User Authentication",
        scenarios: [
          {
            name: "Successful Login",
            steps: [
              { type: "Given", description: "I am on the login page" },
              { type: "When", description: "I enter valid credentials" },
              {
                type: "Then",
                description: "I should be redirected to dashboard",
              },
            ],
          },
        ],
        status: "ready",
        author: "system@testflow.ai",
      },
      {
        id: uuidv4(),
        testId: uuidv4(),
        suiteId: createdSuites[0]._id,
        name: "Invalid Login Test",
        tags: ["authentication", "login", "negative"],
        priority: "medium",
        appUrl: "https://app.testflow.ai",
        browser: "chrome",
        timeout: 30000,
        preconditions: ["Application is accessible"],
        feature: "User Authentication",
        scenarios: [
          {
            name: "Failed Login with Invalid Credentials",
            steps: [
              { type: "Given", description: "I am on the login page" },
              { type: "When", description: "I enter invalid credentials" },
              { type: "Then", description: "I should see an error message" },
            ],
          },
        ],
        status: "ready",
        author: "system@testflow.ai",
      },
      // API Integration Suite Tests
      {
        id: uuidv4(),
        testId: uuidv4(),
        suiteId: createdSuites[1]._id,
        name: "API Key Generation Test",
        tags: ["api", "key-generation", "integration"],
        priority: "critical",
        appUrl: "https://api.testflow.ai",
        browser: "chrome",
        timeout: 45000,
        preconditions: ["User is authenticated", "API service is running"],
        feature: "API Key Management",
        scenarios: [
          {
            name: "Generate New API Key",
            steps: [
              { type: "Given", description: "I am logged in as a user" },
              { type: "When", description: "I request a new API key" },
              { type: "Then", description: "I should receive a valid API key" },
            ],
          },
        ],
        status: "ready",
        author: "system@testflow.ai",
      },
      // User Management Suite Tests
      {
        id: uuidv4(),
        testId: uuidv4(),
        suiteId: createdSuites[2]._id,
        name: "User Registration Test",
        tags: ["registration", "user-management", "smoke"],
        priority: "high",
        appUrl: "https://app.testflow.ai",
        browser: "chrome",
        timeout: 30000,
        preconditions: ["Application is accessible"],
        feature: "User Registration",
        scenarios: [
          {
            name: "Successful Registration",
            steps: [
              { type: "Given", description: "I am on the registration page" },
              {
                type: "When",
                description: "I fill in valid registration details",
              },
              {
                type: "Then",
                description: "I should be registered successfully",
              },
            ],
          },
        ],
        status: "ready",
        author: "system@testflow.ai",
      },
      // E-commerce Suite Tests
      {
        id: uuidv4(),
        testId: uuidv4(),
        suiteId: createdSuites[3]._id,
        name: "Add to Cart Test",
        tags: ["ecommerce", "cart", "shopping"],
        priority: "high",
        appUrl: "https://shop.testflow.ai",
        browser: "chrome",
        timeout: 30000,
        preconditions: ["User is logged in", "Products are available"],
        feature: "Shopping Cart",
        scenarios: [
          {
            name: "Add Product to Cart",
            steps: [
              { type: "Given", description: "I am on the product page" },
              { type: "When", description: "I click add to cart" },
              { type: "Then", description: "Product should be added to cart" },
            ],
          },
        ],
        status: "ready",
        author: "system@testflow.ai",
      },
    ];

    const createdTests = await TestModel.insertMany(tests);
    console.log(`✅ Created ${createdTests.length} tests`);

    // Create test runs with results
    const testRuns = [
      {
        id: uuidv4(),
        testId: createdTests[0].testId,
        suiteId: createdSuites[0]._id,
        status: "passed",
        summary: "Test completed successfully with expected behavior",
        executionTimeMs: 2300,
        startTimestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
        endTimestamp: new Date(Date.now() - 2 * 60 * 1000 + 2300).toISOString(),
        logs: [
          "Starting authentication test",
          "Navigating to login page",
          "Entering valid credentials",
          "Clicking login button",
          "Verifying dashboard redirect",
          "Test completed successfully",
        ],
        author: "system@testflow.ai",
      },
      {
        id: uuidv4(),
        testId: createdTests[1].testId,
        suiteId: createdSuites[0]._id,
        status: "failed",
        summary: "Test failed due to incorrect error message validation",
        executionTimeMs: 4100,
        startTimestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        endTimestamp: new Date(Date.now() - 5 * 60 * 1000 + 4100).toISOString(),
        logs: [
          "Starting invalid login test",
          "Navigating to login page",
          "Entering invalid credentials",
          "Clicking login button",
          "Validating error message",
          "Test failed - error message mismatch",
        ],
        author: "system@testflow.ai",
      },
      {
        id: uuidv4(),
        testId: createdTests[2].testId,
        suiteId: createdSuites[1]._id,
        status: "passed",
        summary: "API key generated successfully with proper format",
        executionTimeMs: 3700,
        startTimestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
        endTimestamp: new Date(Date.now() - 8 * 60 * 1000 + 3700).toISOString(),
        logs: [
          "Starting API key generation test",
          "Authenticating with API service",
          "Sending key generation request",
          "Validating response format",
          "Verifying key permissions",
          "Test completed successfully",
        ],
        author: "system@testflow.ai",
      },
    ];

    const createdRuns = await TestRunModel.insertMany(testRuns);
    console.log(`✅ Created ${createdRuns.length} test runs`);

    // Update test suite test counts
    for (const suite of createdSuites) {
      const testCount = await TestModel.countDocuments({ suiteId: suite._id });
      await TestSuiteModel.findByIdAndUpdate(suite._id, { testCount });
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Test Suites: ${createdSuites.length}`);
    console.log(`   - Tests: ${createdTests.length}`);
    console.log(`   - Test Runs: ${createdRuns.length}`);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
};
