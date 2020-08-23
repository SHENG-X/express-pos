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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
