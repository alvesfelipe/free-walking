const knex = require('../db/knex');
const queriesHashtags = require('./queries_hashtags');

const groupBy = (data, key) => data.reduce((rv, x) => {
  const aux = rv;
  (aux[x[key]] = aux[x[key]] || []).push(x);
  return aux;
}, {});

const getAllCard = info => knex.select(info)
  .from('cards')
  .leftJoin('cards_hashtags', 'cards_hashtags.cards_id', 'cards.id')
  .leftJoin('hashtags', 'cards_hashtags.hashtags_id', 'hashtags.id');

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
      const info = ['cards.id', 'title', 'description', 'latitude', 'longitude', 'hashtag'];
      getAllCard(info).then((res) => {
        const grouped = groupBy(res, 'id');
        const elements = [];
        if (grouped) {
          Object.keys(grouped).forEach((element) => {
            const tags = grouped[element].map(item => item.hashtag);
            delete grouped[element][0].hashtag;
            elements.push(Object.assign(grouped[element][0], { hashtags: tags }));
          });
        }
        resolve(elements);
      });
    });
  },
  getOne(id) {
    return new Promise((resolve) => {
      const info = ['cards.id', 'title', 'description', 'latitude', 'longitude', 'hashtag'];
      getAllCard(info).where('cards.id', id)
        .then((result) => {
          const tags = result.map(item => item.hashtag);
          const aux = result;
          delete aux.hashtag;
          resolve(Object.assign(result[0], { hashtags: tags }));
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
          if (cd.hashtags[0] !== null) {
            this.deleteCardTags(cd.hashtags).then(() => this.detachCardsId(id))
              .then(() => {
                const allPromises = [];
                if (card.hashtags[0] !== null) {
                  card.hashtags.forEach((element) => {
                    allPromises.push(this.insertCardHashtag(element, id));
                  });
                  Promise.all(allPromises).then(() => {
                    resolve(card);
                  });
                }
                resolve(card);
              });
          }
          resolve(card);
        });
      });
    });
  },
  delete(id) {
    return new Promise((resolve) => {
      this.getOne(id).then((card) => {
        if (card.hashtags[0] !== null) {
          this.deleteCardTags(card.hashtags).then(() => this.detachCardsId(id))
            .then(() => {
              resolve(knex('cards').where('id', id).del());
            });
        }
        resolve(knex('cards').where('id', id).del());
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
