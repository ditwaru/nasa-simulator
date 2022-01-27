const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists,
} = require('../../models/launches.model');

const httpGetAllLaunches = async (req, res) => {
  res.json(await getAllLaunches());
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.target) {
    return res.status(400).json({
      error: 'Missing launch property',
    });
  }

  const dateNumberInMs = new Date(launch.launchDate).getTime();
  if (isNaN(dateNumberInMs)) {
    return res.status(400).json({
      error: 'Invalid date',
    });
  }

  res.status(201).json(await addNewLaunch(launch));
};

const httpAbortLaunch = async (req, res) => {
  const id = +req.params.id;

  const validLaunch = await launchExists(id);
  if (id && validLaunch) {
    await abortLaunch(id);
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
