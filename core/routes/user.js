const express = require('express');
const router = express.Router();

const { signInUser, signUpUser, updateUser } = require('../services/userService');

router.post('/', signInUser);

router.post('/create', signUpUser);

router.put('/', updateUser);

module.exports = router;
