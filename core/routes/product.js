const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

router.get('/', productService.getProduct);

router.post('/', productService.createProduct);

router.put('/', productService.updateProduct);

router.delete('/', productService.deleteProduct);

module.exports = router;