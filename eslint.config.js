module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: { requireConfigFile: false },
    extends: ['standard', 'prettier'],
    plugins: ['import'],
    rules: {
        'import/order': 'error',
        'no-console': 'error',
        'no-unused-vars': ['error', { ignoreRestSiblings: true }],
        'no-var': 'error',
        quotes: ['error', 'single', { avoidEscape: true }]
    },
    overrides: [
        {
            files: '**/*.{test,spec}.js',
            env: { mocha: true, jasmine: true, jest: true },
            rules: { 'no-unused-expressions': 'off' }
        }
    ]
}