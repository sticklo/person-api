const request = require('supertest');
const app = require('../app'); 

describe('Person Routes', () => {
  let createdPersonId;

  // Create a person before running the tests
  beforeAll(async () => {
    const response = await request(app)
      .post('/api')
      .send({ name: 'John Doe', age: 30 });

    createdPersonId = response.body._id;
  });

  it('should update a person by id or name', async () => {
    const response = await request(app)
      .patch(`/api/${createdPersonId}`)
      .send({ name: 'John Doe Updated', age: 35 });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('John Doe Updated');
    
  });

  it('should delete a person by id or name', async () => {
    const response = await request(app).delete(`/api/${createdPersonId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Person deleted successfully');
  });

  // Clean up the created person after running the tests
  afterAll(async () => {
    await request(app).delete(`/api/${createdPersonId}`);
  });
});
