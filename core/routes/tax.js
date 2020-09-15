const express = require('express');
const router = express.Router();

const { updateTax, getTax } = require('../services/taxService');

router.get('/', getTax);

router.put('/', updateTax);

module.exports = router;
