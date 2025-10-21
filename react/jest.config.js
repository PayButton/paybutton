/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['./'],
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx,mjs}',
  ],
  coveragePathIgnorePatterns: [
    "src/*",
    "lib/themes",
    "lib/tests",
    "lib/assets"
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@babylonjs/core|@babylonjs/loaders)).+.[t|j]sx?$',
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>"
  },
  setupFiles: ['./jest.setup.js'],
  projects: [
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/lib/tests/!(components)/**/*.(test|spec).[jt]s?(x)'],
      setupFiles: ['<rootDir>/jest.setup.js'],
    },
    {
      displayName: 'react',
      preset: 'ts-jest',
      testEnvironment: 'jest-environment-jsdom',
      testEnvironmentOptions: {
        html: '<!doctype html><html><body></body></html>',
        url: 'http://localhost/',
      },
      testMatch: ['<rootDir>/lib/tests/components/**/*.(test|spec).[jt]s?(x)'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    },
  ],
}
