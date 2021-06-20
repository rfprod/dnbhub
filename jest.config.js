module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
  setupFilesAfterEnv: [`${__dirname}/src/test-setup.ts`],
  transformIgnorePatterns: ['node_modules/(?!@ngrx|@ngxs)'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  coverageReporters: ['html-spa', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverage: true,
  noStackTrace: true,
  cacheDirectory: '/tmp/jest_rs/dnbhub',
};
