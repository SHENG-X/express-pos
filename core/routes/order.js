const express = require('express');
const router = express.Router();

const { getOrder, createOrder, deleteOrder } = require('../services/orderService');

router.get('/', getOrder);

router.post('/', createOrder);

router.delete('/', deleteOrder);

module.exports = router;
