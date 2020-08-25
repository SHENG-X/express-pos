const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  thumbnail: {
    type: String,
    default: '',
  },
  enable: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
    required: true,
  },
  prices: {
    type: [Number],
    required: true,
  },
  cost :{
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
