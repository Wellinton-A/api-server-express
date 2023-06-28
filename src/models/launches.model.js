const axios = require('axios')

const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query'

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })
  if (planet) {
    return await launches.findOneAndUpdate({
      flightNumber: launch.flightNumber
    }, launch, {
      upsert: true
    })
  }
}

async function findLaunch(filter) {
  return await launches.findOne(filter)
}

async function loadLaunchData() {
  const hasLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  })

  if (hasLaunch) {
    return console.log('Launch already loaded.')
  }

  const response = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  })

  const launchDocs = response.data.docs

  for (let i = 0; i < launchDocs.length; i++) {
    const payloads = launchDocs[i].payloads
    const customers = payloads.flatMap(payload => payload.customers)
    const launch = {
      flightNumber: launchDocs[i].flight_number,
      rocket: launchDocs[i].rocket.name,
      mission: launchDocs[i].name,
      upcoming: launchDocs[i].upcoming,
      success: launchDocs[i].success,
      launchDate: launchDocs[i].date_local,
      customers
    }
    await launches.findOneAndUpdate({
      flightNumber: launch.flightNumber
    }, launch, {
      upsert: true
    })
  }
}

async function addNewLaunch(launch) {
  const countLaunches = (await launches.find({})).length
  return {...launch,
    flightNumber: countLaunches,
    upcoming: true,
    success: true,
    customers: ['WASC', 'My bad']
  }
}

async function getAllLaunches(limit, page) {
  const pageQuant = (page - 1) * limit
  return await launches
    .find({}, { "_id": false })
    .sort({ flightNumber: 1 })
    .skip(pageQuant)
    .limit(limit)
}

async function abortLaunchById(launchId) {
  const aborted = await launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  })

  return aborted.modifiedCount === 1
}


async function hasLaunchId(launchId) {
  return await findLaunch({
    flightNumber: launchId
  })
}


module.exports = {
  saveLaunch,
  loadLaunchData,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  hasLaunchId
}