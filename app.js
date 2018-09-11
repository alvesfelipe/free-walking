const express = require('express');
const http = require('http');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config/settings');
const cards = require('./routes/card');

const app = express();

const server = http.createServer(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// allow cross origin requests
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

app.use('/api/cards', cards);

// Starting the server
server.listen('3000', () => {
  console.log('Server running on http://%s:%s', config.host, config.port);
});

// Route not found (404)
app.use((req, res) => res.status(404).send({ message: `Route, ${req.url} Not found.` }));

// 500 - Any server error
app.use((err, req, res) => res.status(500).send({ error: err }));

module.exports = app;
