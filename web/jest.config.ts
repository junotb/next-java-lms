import type {Config} from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.?([mc])[jt]s?(x)",
    "**/?(*.)+(spec|test).?([mc])[jt]s?(x)"
  ],
};

export default createJestConfig(config);
