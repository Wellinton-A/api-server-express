const { getAllLaunches, addNewLaunch, hasLaunchId, abortLaunchById, saveLaunch } = require('../../models/launches.model')

async function httpGetAllLaunches(req, res) {
  const { limit, page } = req.query
  res.status(200).json(await getAllLaunches(limit, page))
}

async function httpPostLaunch(req, res) {
  const launch = req.body
  if (!launch.mission || !launch.rocket || !launch.target) {
    return res.status(400).json({
      error: 'missing required launch property.'
    })
  }

  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'invalid date property.'
    })
  }

  const newLaunch = await addNewLaunch(launch)

  const isNewLaunchValid = await saveLaunch(newLaunch)

  if (isNewLaunchValid === undefined) {
    return res.status(400).json({
      error: 'invalid target exoplanet.'
    })
  }

  return res.status(201).json(newLaunch)
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id)

  const isLaunchExist = await hasLaunchId(launchId)

  if(!isLaunchExist) {
     return res.status(400).json({
      error: "Launch not found."
    })
  }
  const aborted = await abortLaunchById(launchId)

  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted."
    })
  }

  return res.status(200).json({
    id: launchId,
    aborted: 'true'
  })
}

module.exports ={
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch
}