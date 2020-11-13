module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer',
      ],
    },
  },
  setupFilesAfterEnv: [`${__dirname}/src/test-setup.ts`],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!@ngrx|@ngxs)'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  coverageReporters: ['html-spa'],
  collectCoverage: true,
  cacheDirectory: '/tmp/jest_rs/dnbhub',
  noStackTrace: true,
};
