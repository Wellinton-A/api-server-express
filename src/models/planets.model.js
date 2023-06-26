const { parse } =  require('csv-parse')

const planets = require('./planets.mongo')

const fs = require('fs')
const path = require('path')

function habitablePlanetFilter(planet) {
  if (planet.koi_disposition === 'CONFIRMED'
  && planet.koi_insol > '0.36'
  && planet.koi_insol < '1.11'
  && planet.koi_prad < '1.6') {
    return planet
  }
}

async function loadPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../', '../', 'data', 'kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true
    }))
    .on('data', async (data) => {
      if(habitablePlanetFilter(data)) {
        await savePlanet(data)
      }
    })
    .on('error', (err) => {
      console.log(err)
      reject(err)
    })
    .on('end', async () => {
      const countPlanetsFound = (await getAllPlanets()).length
      console.log(`${countPlanetsFound} habitable planets found.`)
      resolve()
    })
  })
}

async function getAllPlanets() {
  return await planets.find({}, {
    "__v": false, "_id": false  })
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name
    }, {
      upsert: true
    })
  } catch(err) {
    console.error(err)
  }
}

module.exports = {
  getAllPlanets,
  loadPlanets
}
