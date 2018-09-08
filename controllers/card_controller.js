exports.index = (req, res) => {
  console.log('get all cards');
  res.json({ all: 'all_cards' });
};

exports.show = (req, res) => {
  console.log('get card by id %s', req.params.card_id);
  res.json({ id: req.params.card_id });
};
