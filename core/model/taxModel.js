const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taxSchema = new Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enable: {
    type: Boolean,
    default: true,
  },
  rate: {
    type: Number,
    default: 0.0
  }
});

const taxModel = mongoose.model('Tax', taxModel);

module.exports = taxModel;
