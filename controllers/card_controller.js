const queries = require('../models/queries_cards');

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

exports.insert = (req, res, next) => {
  const hashtagsArray = req.body.hashtags;
  delete req.body.hashtags;
  queries.create(req.body).then((card) => {
    if (hashtagsArray) {
      const allPromises = [];
      hashtagsArray.forEach((element) => {
        allPromises.push(queries.insertCardHashtag(element, card[0].id));
      });
      Promise.all(allPromises).then(() => {
        res.json(Object.assign(card[0], { hashtags: hashtagsArray }));
      }).catch((err) => { console.log(err); });
    } else {
      res.json(Object.assign(card[0]));
    }
  }).catch((err) => { console.log(err); });
};

exports.update = (req, res, next) => {
  queries.update(req.params.card_id, req.body).then((card) => {
    res.json(card);
  });
};

exports.delete = (req, res) => {
  queries.delete(req.params.card_id).then(() => {
    res.json({ deleted: true });
  });
};
