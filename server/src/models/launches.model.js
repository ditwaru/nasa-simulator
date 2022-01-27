const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const DEFAULT_INITIAL_LAUNCH = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

const saveLaunchToDB = async (launch) => {
  try {
    const validPlanet = await planets.findOne({ keplerName: launch.target });

    if (!validPlanet) {
      throw new Error('Planet not found');
    }

    await launches.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true }
    );
  } catch (err) {
    console.error(err);
  }
};

const getAllLaunches = async () => {
  return await launches.find({}, { __id: 0, __v: 0 });
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  if (latestLaunch) {
    return latestLaunch.flightNumber;
  }

  return DEFAULT_FLIGHT_NUMBER;
};

const addNewLaunch = async (launch) => {
  const latestFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Top Secret Agency'],
    flightNumber: latestFlightNumber,
  });

  await saveLaunchToDB(newLaunch);
  return newLaunch;
};

const launchExists = async (id) => {
  return launches.findOne({ flightNumber: id });
};
const abortLaunch = async (flightNumber) => {
  await launches.findOneAndUpdate(
    { flightNumber },
    { upcoming: false, success: false }
  );
};

module.exports = {
  launches,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists,
};
