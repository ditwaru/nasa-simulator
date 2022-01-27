const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists,
} = require('../../models/launches.model');

const httpGetAllLaunches = (req, res) => {
  res.json(getAllLaunches());
};

const httpAddNewLaunch = (req, res) => {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.target) {
    return res.status(400).json({
      error: 'Missing launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid date',
    });
  }

  addNewLaunch(launch);
  res.status(201).json(launch);
};

const httpAbortLaunch = (req, res) => {
  const id = +req.params.id;
  if (id && launchExists(id)) {
    abortLaunch(id);
    return res.status(200).json(id);
  }
  return res.status(404).json({
    error: 'Launch not found',
  });
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
