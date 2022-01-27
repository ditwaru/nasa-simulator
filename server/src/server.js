const { createServer } = require('http');
const app = require('./app');
const { mongooseConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');

const server = createServer(app);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await mongooseConnect();
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
