const mongoose = require('mongoose');

const StoreModel = require('./storeModel');

const { Schema } = mongoose;

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
    thumbnailFileName: {
      type: String,
      default: '',
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
        },
      }],
      required: true,
    },
    cost: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.post('save', async (product, next) => {
  // find store object by product's store ref
  const store = await StoreModel.findById(product.store);

  if (!store.products.find((prod) => prod.toString() === product.id)) {
    // if product is not in the store products
    // add current product ref to the store products list
    store.products.push(product.id);
    // update store
    await store.save();
  }

  next();
});

productSchema.post('deleteOne', { document: true }, async (product, next) => {
  // find store object by product's store ref
  const store = await StoreModel.findById(product.store);
  // remove current product ref from the store products list
  store.products = store.products.filter((pid) => pid.toString() !== product.id);
  // update store
  await store.save();
  next();
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
