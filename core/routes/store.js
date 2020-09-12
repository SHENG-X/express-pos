const express = require('express');
const router = express.Router();
const { getStore } = require('../services/storeService');

router.get('/', getStore);

module.exports = router;
