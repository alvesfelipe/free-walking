const knex = require('../knex');
const queriesHashtags = require('./queries_hashtags');

const getCardsPlusTags = card => new Promise((resolve, reject) => {
  knex('cards_hashtags').where('cards_id', card.id).then((cardsTags) => {
    const allPromises = [];
    cardsTags.forEach((tags) => {
      allPromises.push(queriesHashtags.getById(tags.hashtags_id));
    });
    Promise.all(allPromises).then((result) => {
      const tagArray = [result.map(tag => tag.hashtag)];
      resolve(Object.assign(card, { hashtags: tagArray[0] }));
    }).catch(err => reject(err));
  }).catch(err => reject(err));
});

module.exports = {
  getAll() {
    return new Promise((resolve) => {
      knex('cards').then((cards) => {
        const cardsPlusTags = [];
        cards.forEach((item) => {
          cardsPlusTags.push(getCardsPlusTags(item));
        });
        Promise.all(cardsPlusTags).then((result) => {
          console.log(result);
          resolve(result);
        });
      });
    });
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
  getCardsHashtagsByHashtag(hashtagId) {
    return knex('cards_hashtags').where('hashtags_id', hashtagId);
  },
};
