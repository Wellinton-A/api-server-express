const { parse } =  require('csv-parse')

const fs = require('fs')
const path = require('path')

const planets = []

function habitablePlanet(planet) {
  if (planet.koi_disposition === 'CONFIRMED'
  && planet.koi_insol > '0.36'
  && planet.koi_insol < '1.11'
  && planet.koi_prad < '1.6') {
    return planet
  }
}

function loadPlanets() {
  new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../', '../', 'data', 'kepler_data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true
    }))
    .on('data', async (data) => {
      if(habitablePlanet(data)) {
        planets.push(data)
      }
    })
    .on('error', (err) => {
      console.log(err)
      reject(err)
    })
    .on('end', async () => {
      resolve()
    })
  })
}


module.exports = {
  planets,
  loadPlanets
}
