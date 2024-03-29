
module.exports = {
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  },
  collectCoverage:true,
  collectCoverageFrom: [
    "src/**/*.{jsx}",
    "!src/**/*_app.tsx",
    "!src/**/*_document.tsx",
    "!src/**/*.spec.tsx",//excluindo apens
  ],
  coverageReporters: ["lcov", "json"]
};