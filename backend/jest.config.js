/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/middleware/auth.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  verbose: false,
};