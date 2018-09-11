const cards = require('../../support/seeds/cards');

// Deletes ALL existing entries
exports.seed = (knex, Promise) => knex('card').del()
  // Inserts seed entries
  .then(() => knex('card').insert(cards));
