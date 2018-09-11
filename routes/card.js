const express = require('express');
const cardController = require('../controllers/card_controller');
const validator = require('../helpers/validators');

const router = express.Router();

module.exports = router
  .get('/', cardController.index)
  .get('/:card_id', validator.validateId, cardController.show)
  .post('/', validator.validateCard, cardController.insert)
  .put('/:card_id', validator.validateId, validator.validateCard, cardController.update);
