const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeModel = require('./storeModel');

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

productSchema.post('save', async (product, next) => {
  // find store object by product's store ref
  const store = await storeModel.findById(product.store);

  if (!store.products.find(prod => prod.id.toString() === product.id)){
    // if product is not in the store products
    // add current product ref to the store products list 
    store.products.push(product.id);
    // update store
    await store.save();
  }

  next();
});

productSchema.post('deleteOne', {document: true}, async (product, next) => {
  // find store object by product's store ref
  const store = await storeModel.findById(product.store);
  // remove current product ref from the store products list
  store.products = store.products.filter(pid => pid.toString() !== product.id);
  // update store 
  await store.save();
  next();
});

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
