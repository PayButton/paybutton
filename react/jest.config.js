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
  coverageThreshold: {
    "global": {
      "lines": 80
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@babylonjs/core|@babylonjs/loaders)).+.[t|j]sx?$',
  ],
};
