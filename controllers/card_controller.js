const queries = require('../models/queries_cards');
const queriesHashtags = require('../models/queries_hashtags');

exports.index = (req, res) => {
  queries.getAll().then((result) => {
    res.json(result);
  });
};

exports.show = (req, res, next) => {
  queries.getOne(req.params.card_id).then((result) => {
    if (result) res.json(result);
    else next();
  });
};

const insertCardHashtag = (value, card) => queriesHashtags.getByValue(value).then((result) => {
  if (!result) {
    queriesHashtags.create({ hashtag: value }).then((hashtag) => {
      queries.attachCardsHashtags(card.id, hashtag[0].id).then();
    });
  } else {
    queries.attachCardsHashtags(card.id, result.id).then();
  }
});

exports.insert = (req, res, next) => {
  const hashtagsArray = req.body.hashtags;
  delete req.body.hashtags;
  queries.create(req.body).then((card) => {
    if (hashtagsArray) {
      hashtagsArray.forEach((element) => {
        insertCardHashtag(element, card[0]);
      });
    }
    res.json(Object.assign(card[0], { hashtags: hashtagsArray }));
  });
};

exports.update = (req, res, next) => {
  queries.update(req.params.card_id, req.body).then((card) => {
    res.json(card[0]);
  });
};

exports.delete = (req, res) => {
  queries.delete(req.params.card_id).then(() => {
    res.json({ deleted: true });
  });
};
