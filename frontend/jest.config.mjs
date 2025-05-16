/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  
  // Add these configurations:
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
   // Setup file for TextEncoder and TextDecoder polyfills
   setupFiles: ["<rootDir>/jest.setup.js"],

};

export default config;
