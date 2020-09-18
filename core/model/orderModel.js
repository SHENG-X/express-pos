const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productModel = require('./productModel');

const orderSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['Cash', 'Card', 'None'],
      default: 'None'
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    discount: {
      type: {
        method: {
          type: String,
          enum: ['Percent', 'Amount'],
          required: true
        },
        value: {
          type: Number,
          default: 0,
        }
      },
      default: null,
    },
    products: {
      type: [
        {
          product: {
              type: Schema.Types.ObjectId,
              ref: 'Product'
          },
          price: {
            type: Number,
            required: true,
          },
          cost: {
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
    processedBy: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true
  },
);

orderSchema.post('save', {document: true}, async (order, next) => {
  // on new order is created, loop through all products in the order
  order.products.forEach(async (prod) => {
    const prodObj = await productModel.findById(prod.product);
    // deduct product count
    prodObj.count -= prod.count;
    await prodObj.save();
  });
  next();
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
