const express = require('express');
const config = require('./config/settings');
const cards = require('./routes/card');

const app = express();

app.use('/api/cards', cards);

app.listen('3000', () => {
  console.log('Server running on http://%s:%s', config.host, config.port);
});
