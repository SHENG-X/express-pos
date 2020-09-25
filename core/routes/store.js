const express = require('express');

const { getStore } = require('../services/storeService');

const router = express.Router();

router.get('/', getStore);

module.exports = router;
