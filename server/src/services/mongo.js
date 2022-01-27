const mongoose = require('mongoose');
const MONGO_URL =
  'mongodb+srv://nasa-api:W4vxjnSXdg7VxLrL@nasacluster.87yt2.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log('Mongoose connection is open');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

const mongooseConnect = async () => mongoose.connect(MONGO_URL);
const mongooseDisconnect = async () => mongoose.disconnect();
module.exports = { mongooseConnect, mongooseDisconnect };
