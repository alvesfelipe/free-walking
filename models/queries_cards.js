const knex = require('../db/knex');
const queriesHashtags = require('./queries_hashtags');

const getCardPlusTags = card => new Promise((resolve, reject) => {
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
          cardsPlusTags.push(getCardPlusTags(item));
        });
        Promise.all(cardsPlusTags).then((result) => {
          console.log(result);
          resolve(result);
        });
      });
    });
  },
  getOne(id) {
    return new Promise((resolve) => {
      knex('cards').where('id', id).first().then((card) => {
        resolve(getCardPlusTags(card));
      });
    });
  },
  create(card) {
    return knex('cards').insert(card, '*');
  },
  update(id, card) {
    return knex('cards').where('id', id).update(card, '*');
  },
  delete(id) {
    return new Promise((resolve) => {
      this.getOne(id).then((card) => {
        const allPromises = [];
        card.hashtags.forEach((item) => {
          allPromises.push(queriesHashtags.getByValue(item).then((tag) => {
            this.getCardsHashtagsByHashtag(tag.id).then((result) => {
              if (Object.keys(result).length === 1) { queriesHashtags.delete(tag.id).then(); }
            });
          }));
        });
        Promise.all(allPromises).then(() => {
          this.detachCardsId(id).then(() => {
            resolve(knex('cards').where('id', id).del());
          });
        });
      });
    });
  },
  attachCardsHashtags(cardId, hashtagId) {
    return knex('cards_hashtags').insert({ cards_id: cardId, hashtags_id: hashtagId }, '*');
  },
  detachCardsHashtags(cardId, hashtagId) {
    return knex('cards_hashtags').where({ cards_id: cardId, hashtags_id: hashtagId }).del();
  },
  detachCardsId(cardId) {
    return knex('cards_hashtags').where('cards_id', cardId).del();
  },
  getCardsHashtagsByHashtag(hashtagId) {
    return knex('cards_hashtags').where('hashtags_id', hashtagId);
  },
};
