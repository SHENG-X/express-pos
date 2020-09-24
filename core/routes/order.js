const express = require('express');

const { getOrder, createOrder, deleteOrder } = require('../services/orderService');

const router = express.Router();

router.get('/', getOrder);

router.post('/', createOrder);

router.delete('/', deleteOrder);

module.exports = router;
