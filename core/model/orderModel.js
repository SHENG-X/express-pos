const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    products: {
      type: [
        {
          product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Product'
          },
          price: {
            type: Number,
            required: true,
          },
          count: {
            type: Number,
            default: 1,
          }
        }
      ],
      required: true,
    },
  },
  {
    timestamps: true
  },
);

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
