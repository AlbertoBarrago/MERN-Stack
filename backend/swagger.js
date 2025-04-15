const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MERN Blueprint API',
            version: '1.0.0',
            description: 'API documentation for MERN Blueprint',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://your-production-url.com'  // Replace with your production URL
                    : 'http://localhost:5001',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        tags: [
            {
                name: 'Users',
                description: 'User management endpoints'
            },
            {
                name: 'Items',
                description: 'Item management endpoints'
            }
        ],
        paths: {
            '/api/users': {
                post: {
                    tags: ['Users'],
                    summary: 'Register a new user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        name: { type: 'string' },
                                        email: { type: 'string' },
                                        password: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'User created successfully' },
                        400: { description: 'Invalid data' }
                    }
                }
            },
            '/api/users/login': {
                post: {
                    tags: ['Users'],
                    summary: 'Login user',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: {
                                            type: 'string',
                                            example: 'user@example.com'
                                        },
                                        password: {
                                            type: 'string',
                                            example: 'yourpassword123'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            _id: {
                                                type: 'string',
                                                example: '64c12345a1b2c3d4e5f67890'
                                            },
                                            name: {
                                                type: 'string',
                                                example: 'John Doe'
                                            },
                                            email: {
                                                type: 'string',
                                                example: 'user@example.com'
                                            },
                                            token: {
                                                type: 'string',
                                                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        401: { description: 'Invalid credentials' }
                    }
                }
            },
            '/api/users/me': {
                get: {
                    tags: ['Users'],
                    summary: 'Get user profile',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'User profile retrieved' },
                        401: { description: 'Not authorized' }
                    }
                }
            },
            '/api/items': {
                get: {
                    tags: ['Items'],
                    summary: 'Get all items',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'List of items retrieved' }
                    }
                },
                post: {
                    tags: ['Items'],
                    summary: 'Create a new item',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        text: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Item created successfully' },
                        400: { description: 'Invalid data' }
                    }
                }
            },
            '/api/items/{id}': {
                put: {
                    tags: ['Items'],
                    summary: 'Update an item',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        text: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Item updated successfully' },
                        404: { description: 'Item not found' }
                    }
                },
                delete: {
                    tags: ['Items'],
                    summary: 'Delete an item',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            in: 'path',
                            name: 'id',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Item deleted successfully' },
                        404: { description: 'Item not found' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

module.exports = options;