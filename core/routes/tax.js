const express = require('express');
const router = express.Router();

const { updateTax } = require('../services/taxService');

router.put('/', updateTax);

module.exports = router;
