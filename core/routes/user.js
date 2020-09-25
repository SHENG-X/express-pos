const express = require('express');

const strict = require('../middleware/strict');
const {
  signInUser,
  signUpUser,
  updateUser,
  addStaff,
  getStaff,
  updateStaff,
  deleteStaff,
} = require('../services/userService');

const router = express.Router();

router.get('/', strict.authenticate, getStaff);

router.post('/', signInUser);

router.post('/create', signUpUser);

router.post('/staff', strict.authenticate, addStaff);

router.put('/staff', strict.authenticate, updateStaff);

router.delete('/staff', strict.authenticate, deleteStaff);

router.put('/', updateUser);

module.exports = router;
