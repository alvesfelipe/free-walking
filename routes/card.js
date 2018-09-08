const express = require('express');
const cardController = require('../controllers/card_controller');

const router = express.Router();

module.exports = router
  .get('/', cardController.index)
  .get('/:card_id', cardController.show);
