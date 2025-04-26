const request = require('supertest');
const app = require('../server'); // Assuming server.js initializes the app

// Mock data
const mockItem = { name: 'Test Item', description: 'Test Description' };

// Test suite for item routes
describe('Item Routes', () => {
  it('should fetch all items', async () => {
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should fetch a single item by ID', async () => {
    const response = await request(app).get('/api/items/1'); // Replace with a valid ID
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should create a new item', async () => {
    const response = await request(app)
      .post('/api/items')
      .send(mockItem)
      .set('Authorization', 'Bearer <token>'); // Replace <token> with a valid token
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', mockItem.name);
  });

  it('should update an item by ID', async () => {
    const response = await request(app)
      .put('/api/items/1') // Replace with a valid ID
      .send({ name: 'Updated Item' })
      .set('Authorization', 'Bearer <token>'); // Replace <token> with a valid token
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Item');
  });

  it('should delete an item by ID', async () => {
    const response = await request(app)
      .delete('/api/items/1') // Replace with a valid ID
      .set('Authorization', 'Bearer <token>'); // Replace <token> with a valid token
    expect(response.status).toBe(200);
  });
});