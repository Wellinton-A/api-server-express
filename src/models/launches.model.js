const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })
  if (planet) {
    await launches.findOneAndUpdate({
      flightNumber: launch.flightNumber
    }, launch, {
      upsert: true
    })
    return true
  } else {
    return false
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

async function getAllLaunches() {
  return await await launches.find({}, {
    "_id": false  })
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
  return await launches.findOne({
    flightNumber: launchId
  })
}


module.exports = {
  saveLaunch,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  hasLaunchId
}