const path = require('path');

const config = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/free_walking',
    migrations: {
      directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds'),
    },
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/test_free_walking',
    migrations: {
      directory: path.join(__dirname, '/db/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/db/seeds'),
    },
  },
};

module.exports = config;
