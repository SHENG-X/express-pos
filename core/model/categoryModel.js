const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnailFlag: {
      type: Boolean,
      default: false,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;
