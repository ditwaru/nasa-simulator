const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const loadLaunchData = async () => {
  try {
    const firstLaunch = await findLaunch({
      flightNumber: 1,
      rocket: 'Falcon 1',
      mission: 'FalconSat',
    });

    if (firstLaunch) {
      console.log('launches already populated');
    } else {
      populateLaunches();
    }
  } catch (err) {
    console.error(err);
  }
};

const populateLaunches = async () => {
  try {
    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1,
            },
          },
          {
            path: 'payloads',
            select: {
              customers: 1,
            },
          },
        ],
      },
    });

    if (response.ok !== 200) {
      console.log('Problem downloading launch data');
      throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
      const payloads = launchDoc['payloads'];
      const customers = payloads.flatMap((payload) => payload['customers']);
      const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers,
      };

      await saveLaunchToDB(launch);
    }
  } catch (err) {
    console.error(err);
  }
};

const saveLaunchToDB = async (launch) => {
  try {
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

const getAllLaunches = async (skip, limit) => {
  return await launches
    .find({}, { __id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  if (latestLaunch) {
    return latestLaunch.flightNumber;
  }

  return DEFAULT_FLIGHT_NUMBER;
};

const addNewLaunch = async (launch) => {
  const validPlanet = await planets.findOne({ keplerName: launch.target });

  if (!validPlanet) {
    throw new Error('Planet not found');
  }

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

const findLaunch = async (filter) => {
  return await launches.findOne(filter);
};

const launchExists = async (id) => {
  return await findLaunch({ flightNumber: id });
};
const abortLaunch = async (flightNumber) => {
  await launches.findOneAndUpdate(
    { flightNumber },
    { upcoming: false, success: false }
  );
};

module.exports = {
  launches,
  loadLaunchData,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists,
};
