const request = require('supertest');
const app = require('../../app');
const {
  mongooseConnect,
  mongooseDisconnect,
} = require('../../../src/services/mongo');

describe('Testing Launches API', () => {
  beforeAll(async () => {
    await mongooseConnect();
  });

  afterAll(async () => {
    await mongooseDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'bruh',
      rocket: 'super rocket',
      target: 'Kepler-1652 b',
      launchDate: 'January 5, 2027',
    };

    const missingLaunchData = {
      mission: 'bruh',
      target: 'Kepler-1652 b',
      launchDate: 'January 5, 2027',
    };

    const launchDataWithoutDate = {
      mission: 'bruh',
      rocket: 'super rocket',
      target: 'Kepler-1652 b',
    };

    const launchDataInvalidDate = {
      mission: 'bruh',
      rocket: 'super rocket',
      target: 'Kepler-1652 b',
      launchDate: 'Februasdfasdfary 2nd, 2025',
    };
    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect(201)
        .expect('Content-Type', /json/);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
    });

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(missingLaunchData)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing launch property',
      });
    });
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataInvalidDate)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid date',
      });
    });
  });
});
