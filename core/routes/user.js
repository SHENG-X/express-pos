const express = require('express');
const router = express.Router();

const { signInUser, signUpUser, updateUser, tokenAuth } = require('../services/userService');

router.get('/', tokenAuth);

router.post('/', signInUser);

router.post('/create', signUpUser);

router.put('/', updateUser);

module.exports = router;
