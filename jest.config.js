export default {
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".js", ".jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**"
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/"
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
}; 