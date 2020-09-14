const express = require('express');
const router = express.Router();
const strict = require('../middleware/strict');

const {
  signInUser,
  signUpUser,
  updateUser,
  addStaff,
  getStaff,
  updateStaff,
} = require('../services/userService');

router.get('/', strict.authenticate, getStaff);

router.post('/', signInUser);

router.post('/create', signUpUser);

router.post('/staff', strict.authenticate, addStaff);

router.put('/staff', strict.authenticate, updateStaff);

router.put('/', updateUser);

module.exports = router;
