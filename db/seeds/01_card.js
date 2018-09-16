const cards = require('../../support/seeds/cards');

// Deletes ALL existing entries
exports.seed = (knex, Promise) => knex('cards').del()
  // Inserts seed entries
  .then(() => knex('cards').insert(cards));
