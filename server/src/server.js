const { createServer } = require('http');

const { loadPlanetsData } = require('./models/planets.model');

const app = require('./app');

const server = createServer(app);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
