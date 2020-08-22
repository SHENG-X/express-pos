const express = require('express');
const router = express.Router();

const categoryService = require('../services/categoryService');

router.get('/', categoryService.getCategory);

router.post('/', categoryService.createCategory);

router.put('/', categoryService.updateCategory);

router.delete('/', categoryService.deleteCategory);

module.exports = router;
