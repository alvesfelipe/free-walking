const queries = require('../db/queries');

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
  queries.create(req.body).then((card) => {
    res.json(card[0]);
  });
};

exports.update = (req, res, next) => {
  queries.update(req.params.card_id, req.body).then((card) => {
    res.json(card[0]);
  });
};
