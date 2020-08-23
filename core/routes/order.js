const express = require('express');
const router = express.Router();

const { getOrder, createOrder, updateOrder, deleteOrder } = require('../services/orderService');

router.get('/', getOrder);

router.post('/', createOrder);

router.put('/', updateOrder);

router.delete('/', deleteOrder);

module.exports = router;
