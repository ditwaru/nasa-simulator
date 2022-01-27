const fs = require('fs');
const { parse } = require('csv-parse');
const { join } = require('path');

const planets = require('./planets.mongo');

const isHabitablePlanet = (planet) => {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
};

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data.kepler_name);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject();
      })
      .on('end', async () => {
        const countPlanets = await getAllPlanets();
        console.log(`${countPlanets.length} habitable planets found`);
        resolve();
      });
  }).catch((err) => {
    console.log(err);
  });
};

const getAllPlanets = async () => {
  return await planets.find({}, { __id: 0, __v: 0 });
};

const savePlanet = async (keplerName) => {
  try {
    await planets.findOneAndUpdate(
      {
        keplerName,
      },
      {
        keplerName,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.err(`Could not save planet: ${err}`);
  }
};

module.exports = { loadPlanetsData, getAllPlanets };
