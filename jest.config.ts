/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__test__/**/*.test.ts"], // test files
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Test Report"
    }]
  ]
};

module.exports = config;
