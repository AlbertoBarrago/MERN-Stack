module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 30000,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'tests/**/*.test.js',
        '!**/node_modules/**',
        '!**/tests/**'
    ],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};