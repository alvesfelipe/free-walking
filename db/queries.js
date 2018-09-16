const knex = require('./knex');

module.exports = {
  getAll() {
    return knex('cards');
  },
  getOne(id) {
    return knex('cards').where('id', id).first();
  },
  create(card) {
    return knex('cards').insert(card, '*');
  },
  update(id, card) {
    return knex('cards').where('id', id).update(card, '*');
  },
  delete(id) {
    return knex('cards').where('id', id).del();
  },
};
