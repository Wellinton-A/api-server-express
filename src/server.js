const http = require('http')
const dotenv = require('dotenv')

dotenv.config()

const app = require('./app')
const { mongoConnect } = require('./services/mongo')
const { loadPlanets } = require('./models/planets.model')
const { loadLaunchData } = require('./models/launches.model')

const server = http.createServer(app)

const PORT = process.env.PORT || 8000

async function startServer() {
  await mongoConnect()
  await loadPlanets()
  await loadLaunchData()

  server.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
  })
}

startServer()
