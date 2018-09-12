exports.validateId = (req, res, next) => {
  if (!isNaN(req.params.card_id)) return next();
  return next(new Error(`Invalid card_id ${req.params.card_id}`));
};

exports.validateCard = (req, res, next) => {
  console.log(req.body);
  const hasTitle = typeof req.body.title === 'string' && req.body.title.trim() !== '';
  const hasDescription = typeof req.body.description === 'string' && req.body.description.trim() !== '';
  const hasLatitude = typeof req.body.latitude === 'number' && req.body.latitude !== null;
  const hasLongitude = typeof req.body.longitude === 'number' && req.body.longitude !== null;
  if (hasTitle && hasDescription && hasLatitude && hasLongitude) return next();
  return next(new Error('Invalid card JSON'));
};
