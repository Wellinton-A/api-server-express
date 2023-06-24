const { parse } =  require('csv-parse')

const fs = require('fs')

const planets = []

function habitablePlanet(planet) {
  if (planet.koi_disposition === 'CONFIRMED'
  && planet.koi_insol > '0.36'
  && planet.koi_insol < '1.11'
  && planet.koi_prad < '1.6') {
    return planet
  }
}

fs.createReadStream('./data/kepler_data.csv')
  .pipe(parse({
    comment: '#',
    columns: true
  }))
  .on('data', (data) => {
    if(habitablePlanet(data)) {
      planets.push(data)
    }
  })
  .on('error', (err) => {
    console.log(err)
  })


module.exports = planets