const fs = require('fs');
const { parse } = require('csv-parse');
const { join } = require('path');

const planets = [];

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
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          planets.push(data);
          resolve();
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject();
      });
  }).catch((err) => {
    console.log(err);
  });
};

const getAllPlanets = () => {
  return planets;
};

module.exports = { loadPlanetsData, getAllPlanets };
