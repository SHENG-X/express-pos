const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  thumbnail: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: [Number],
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.mongo.ObjectID,
    default: null,
  }
});

const productModel = mongoose.Model('Product', productSchema);

module.exports = productModel;
