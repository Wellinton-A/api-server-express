const request = require('supertest')
const app = require('../src/app')
const { mongoConnect, mongoDisconnect } = require('../src/services/mongo')

describe('API Tests', () => {
  beforeAll( async () => {
    await mongoConnect()
  })

  afterAll( async () => {
    await mongoDisconnect()
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      await request(app)
      .get('/v1/launches')
      .expect('Content-Type', /json/)
      .expect(200)
    })
  })

  describe('Test POST /launch', () => {
    const newLaunchWithDate = {
      mission: 'Generic mission',
      rocket: 'Generic Rocket',
      target: 'Kepler-1652 b',
      launchDate: 'december 31, 2023'
    }

    const newLaunchWithoutDate = {
      mission: 'Generic mission',
      rocket: 'Generic Rocket',
      target: 'Kepler-1652 b'
    }

    test('It should respond with 201 created', async () => {
      await mongoConnect()
      const response = await request(app)
        .post('/v1/launches')
        .send(newLaunchWithDate)
        .expect('Content-Type', /json/)
        .expect(201)

      const requestDate = new Date(newLaunchWithDate.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()

      expect(requestDate).toBe(responseDate)
      expect(response.body).toMatchObject(newLaunchWithoutDate)
    })

    test('It should warning about missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({error: "missing required launch property."})
    })

    test('It should warn about invalid date', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(newLaunchWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({error: "invalid date property."})
    })
  })
})
