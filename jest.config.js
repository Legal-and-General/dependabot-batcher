module.exports = {
  automock: false,
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: [ 'json-summary', 'text-summary' ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true,
    },
  },
  moduleDirectories: [ 'node_modules', '<rootDir>/src' ],
  moduleFileExtensions: [ 'ts', 'js' ],
  roots: [ '<rootDir>' ],
  testEnvironment: 'node',
  testMatch: [ '<rootDir>/__tests__/**' ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
};
