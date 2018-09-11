const knex = require('./knex');

module.exports = {
  getAll() {
    return knex('card');
  },
  getOne(id) {
    return knex('card').where('id', id).first();
  },
};
