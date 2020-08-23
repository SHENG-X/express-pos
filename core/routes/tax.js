const express = require('express');
const router = express.Router();

const { getTax, updateTax } = require('../services/taxService');
const { update } = require('../model/userModel');

router.get('/', getTax);

router.put('/', updateTax);

module.exports = router;
