const mongoose = require('mongoose');

const planetsSchema = mongoose.Schema({
  keplerName: {
    type: String,
  },
});

module.exports = mongoose.model('Planet', planetsSchema);
