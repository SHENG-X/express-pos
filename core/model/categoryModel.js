const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  thumbnail: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  }
});

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;
