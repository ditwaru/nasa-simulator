const { createServer } = require('http');

require('dotenv').config();

const app = require('./app');
const { mongooseConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const server = createServer(app);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await mongooseConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
