const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

const getAllLaunches = () => {
  return Array.from(launches.values());
};

const addNewLaunch = (launch) => {
  latestFlightNumber++;
  Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: latestFlightNumber,
  });
  launches.set(latestFlightNumber, launch);
};

const launchExists = (id) => {
  return launches.has(id);
};
const abortLaunch = (flightNumber) => {
  const launch = launches.get(flightNumber);
  launch.upcoming = false;
  launch.success = false;
};

module.exports = {
  launches,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists,
};
