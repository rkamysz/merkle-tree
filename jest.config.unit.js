module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__tests__/**/*.unit.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
};
