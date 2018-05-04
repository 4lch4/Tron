module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js}',
    '!**/node_modules/**'
  ],
  coverageDirectory: './data/coverage/',
  rootDir: '../'
}
