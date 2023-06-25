const { getAllLaunches, addNewLaunch, hasLaunchId, abortLaunchById } = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
  res.status(200).json(getAllLaunches())
}

function httpPostLaunch(req, res) {
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
  addNewLaunch(launch)
  return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id)
  console.log(launchId)
  if(!hasLaunchId(launchId)) {
     return res.status(400).json({
      error: "Launch not found."
    })
  }
  const aborted = abortLaunchById(launchId)
  return res.status(200).json(aborted)
}

module.exports ={
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch
}