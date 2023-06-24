const launches = new Map()

let latestFlightNmber = 0

function addNewLaunch(launch) {
  latestFlightNmber++
  launches.set(latestFlightNmber, Object.assign(launch, {
    flightNumber: latestFlightNmber,
    upcoming: true,
    success: true,
    customers: ['WASC', 'My bad']
  }))
  console.log(launches)
}

function getAllLaunches() {
  return Array.from(launches.values())
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId)
  console.log(aborted)
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

function hasLaunchId(launchId) {
  return launches.has(launchId)
}


module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunchById,
  hasLaunchId
}