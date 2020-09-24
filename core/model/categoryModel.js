const mongoose = require('mongoose');
const StoreModel = require('./storeModel');
const ProductModel = require('./productModel');

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnailFileName: {
      type: String,
      default: '',
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    enable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.post('save', async (category, next) => {
  // after current category was saved to the database
  // append the category ref to the store categories list
  const storeId = category.store.toString();
  const store = await StoreModel.findById(storeId);

  if (!store.categories.find((categoryItem) => categoryItem.toString() === category.id)) {
    // if category ref is not in the store categories
    store.categories.push(category.id);
    await store.save();
  }

  next();
});

categorySchema.post('deleteOne', { document: true }, async (category, next) => {
  // after current category was deleted from the database
  // remove the category ref from the store categories list
  const storeId = category.store.toString();
  const store = await StoreModel.findById(storeId);
  store.categories = store.categories.filter((cid) => cid.toString() !== category.id);
  // remove category ref from products
  store.products.forEach(async (prod) => {
    const product = await ProductModel.findById(prod);
    if (product.category.toString() === category.id) {
      product.category = null;
      await product.save();
    }
  });

  await store.save();
  next();
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;
