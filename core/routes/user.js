const express = require('express');
const router = express.Router();
const strict = require('../middleware/strict');

const {
  signInUser,
  signUpUser,
  updateUser,
  addStaff,
} = require('../services/userService');

router.post('/', signInUser);

router.post('/create', signUpUser);

router.post('/staff', strict.authenticate, addStaff);

router.put('/', updateUser);

module.exports = router;
