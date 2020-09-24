const mongoose = require('mongoose');

const { Schema } = mongoose;

const storeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
      default: false,
    },
    rate: {
      type: Number,
      default: 0.0,
    },
  },
  hiredNo: {
    type: Number,
    default: 1,
  },
});

const StoreModel = mongoose.model('Store', storeSchema);

module.exports = StoreModel;
