const knex = require('../knex');

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
  attachCardsHashtags(cardId, hashtagId) {
    return knex('cards_hashtags').insert({ cards_id: cardId, hashtags_id: hashtagId }, '*');
  },
  detachCardsHashtags(cardId, hashtagId) {
    return knex('cards_hashtags').where({ cards_id: cardId, hashtags_id: hashtagId }).del();
  },
};
