const express = require('express');

const { updateTax, getTax } = require('../services/taxService');

const router = express.Router();

router.get('/', getTax);

router.put('/', updateTax);

module.exports = router;
