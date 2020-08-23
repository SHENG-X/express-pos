const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  categories: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    default: [],
  },
  products: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    default: [],
  },
  tax: {
    enable: {
      type: Boolean,
      default: false
    },
    rate: {
      type: Number,
      default: 0.0
    }
  }
});

const storeModel = mongoose.model('Store', storeSchema);

module.exports = storeModel;
