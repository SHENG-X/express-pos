const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    enable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
    thumbnailFlag: {
      type: Boolean,
      default: false,
    },
    prices: {
      type: [{
        name: {
          type: String,
          default: '',
        },
        value: {
          type: Number,
          required: true,
        }
      }],
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
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
