const knex = require('../db/knex');

module.exports = {
  getAll() {
    return knex('hashtags');
  },
  getOne(id) {
    return knex('hashtags').where('id', id).first();
  },
  getByValue(hashtag) {
    return knex('hashtags').where('hashtag', hashtag).first();
  },
  getById(id) {
    return knex('hashtags').where('id', id).first();
  },
  create(hahstag) {
    return knex('hashtags').insert(hahstag, '*');
  },
  update(id, hahstag) {
    return knex('hashtags').where('id', id).update(hahstag, '*');
  },
  delete(id) {
    return knex('hashtags').where('id', id).del();
  },
};
