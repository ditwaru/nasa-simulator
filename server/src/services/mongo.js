const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log('Mongoose connection is open');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

const mongooseConnect = async () => mongoose.connect(MONGO_URL);
const mongooseDisconnect = async () => mongoose.disconnect();
module.exports = { mongooseConnect, mongooseDisconnect };
