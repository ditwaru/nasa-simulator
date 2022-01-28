const { join } = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const api = require('./routes/api');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // allow from this origin
  })
);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

app.use('/v1', api);
app.get('/*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
