const { errorHandler } = require('../../../middleware/errorMiddleware');

describe('Error Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            statusCode: 200,
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle error with status 500 when res.statusCode is 200', () => {
        const error = new Error('Server Error');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Server Error',
            stack: error.stack
        });
    });

    test('should use existing status code when not 200', () => {
        const error = new Error('Not Found');
        res.statusCode = 404;

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Not Found',
            stack: error.stack
        });
    });

    test('should use error message from error object', () => {
        const error = new Error('Custom Error Message');

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Custom Error Message',
            stack: error.stack
        });
    });

    test('should hide stack trace in production environment', () => {
        // Save original NODE_ENV
        const originalNodeEnv = process.env.NODE_ENV;

        // Set to production
        process.env.NODE_ENV = 'production';

        const error = new Error('Production Error');

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Production Error',
            stack: null
        });

        // Restore original NODE_ENV
        process.env.NODE_ENV = originalNodeEnv;
    });
});