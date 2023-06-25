const request = require('supertest')
const app = require('../src/app')

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    await request(app)
    .get('/launches')
    .expect('Content-Type', /json/)
    .expect(200)
  })
})

describe('Test POST /launch', () => {
  const newLaunchWithDate = {
    mission: 'Generic mission',
    rocket: 'Generic Rocket',
    target: 'Generic exoplanet',
    launchDate: 'december 31, 2023'
  }

  const newLaunchWithoutDate = {
    mission: 'Generic mission',
    rocket: 'Generic Rocket',
    target: 'Generic exoplanet'
  }

  test('It should respond with 201 created', async () => {
    const response = await request(app)
      .post('/launches')
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
      .post('/launches')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({error: "missing required launch property."})
  })

  test('It should warn about invalid date', async () => {
    const response = await request(app)
      .post('/launches')
      .send(newLaunchWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toStrictEqual({error: "invalid date property."})
  })
})