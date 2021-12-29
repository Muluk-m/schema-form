module.exports = {
  rootDir: __dirname,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*?)$': '<rootDir>/packages/$1/src',
  },
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(lodash-es))'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
