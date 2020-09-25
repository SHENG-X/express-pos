const express = require('express');

const productService = require('../services/productService');

const router = express.Router();

router.get('/', productService.getProduct);

router.post('/', productService.createProduct);

router.put('/', productService.updateProduct);

router.put('/restock', productService.restockProduct);

router.delete('/', productService.deleteProduct);

module.exports = router;
