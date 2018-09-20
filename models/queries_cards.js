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
  deleteCardTags(tags) {
    return new Promise((resolve) => {
      const allPromises = [];
      let tagId;
      tags.forEach((item) => {
        const promises = queriesHashtags.getByValue(item)
          .then((tag) => {
            tagId = tag.id;
            return this.getCardsHashtagsByHashtag(tag.id);
          })
          .then((result) => {
            if (Object.keys(result).length === 1) { queriesHashtags.delete(tagId).then(); }
          });
        allPromises.push(promises);
      });
      Promise.all(allPromises).then(() => {
        resolve(true);
      });
    });
  },
  insertCardHashtag(tag, cardId) {
    return new Promise((resolve) => {
      queriesHashtags.getByValue(tag).then((result) => {
        if (!result) {
          queriesHashtags.create({ hashtag: tag }).then((hashtag) => {
            this.attachCardsHashtags(cardId, hashtag[0].id).then(() => resolve());
          });
        } else {
          this.attachCardsHashtags(cardId, result.id).then(() => resolve());
        }
      });
    });
  },
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
    // Getting all cards using sql query
    // return knex.select()
    //   .from('cards')
    //   .leftJoin('cards_hashtags', 'cards.id', 'cards_hashtags.cards_id')
    //   .leftJoin('hashtags', 'cards_hashtags.hashtags_id', 'hashtags.id');
  },
  getOne(id) {
    return new Promise((resolve) => {
      knex.select()
        .from('cards').where('cards.id', id)
        .leftJoin('cards_hashtags', 'cards.id', 'cards_hashtags.cards_id')
        .leftJoin('hashtags', 'cards_hashtags.hashtags_id', 'hashtags.id')
        .then((result) => {
          const tags = result.map(item => item.hashtag);
          const newCard = {
            id: result[0].cards_id,
            title: result[0].title,
            description: result[0].description,
            latitude: result[0].latitude,
            longitude: result[0].longitude,
            hashtags: tags,
          };
          resolve(newCard);
        });
    });
  },
  create(card) {
    return knex('cards').insert(card, '*');
  },
  update(id, card) {
    return new Promise((resolve) => {
      const cardNew = Object.assign({}, card);
      delete cardNew.hashtags;
      knex('cards').where('id', id).update(cardNew, '*').then(() => {
        this.getOne(id).then((cd) => {
          this.deleteCardTags(cd.hashtags).then(() => {
            this.detachCardsId(id).then(() => {
              const allPromises = [];
              card.hashtags.forEach((element) => {
                allPromises.push(this.insertCardHashtag(element, id));
              });
              Promise.all(allPromises).then(() => {
                resolve(card);
              });
            });
          });
        });
      });
    });
  },
  delete(id) {
    return new Promise((resolve) => {
      this.getOne(id).then((card) => {
        this.deleteCardTags(card).then(() => {
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
