const http = require('http')
const mongoose =require('mongoose')

const app = require('./app')
const { mongoConnect } = require('./services/mongo')
const { loadPlanets } = require('./models/planets.model')

const server = http.createServer(app)

const PORT = process.env.PORT || 8000

async function startServer() {
  await mongoConnect()
  await loadPlanets()

  server.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
  })
}

startServer()
