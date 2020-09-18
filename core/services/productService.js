const { writeImageFile, removeImageFile } = require('../utils');
const productModel = require('../model/productModel');
const storeModel = require('../model/storeModel');

const getProduct = async (req, res) => {
  const storeId = req.decoded.store;
  const productId = req.query.pid;

  try {
    if (!productId) {
      // if no product id was set then return 
      // all products belong to the store
      const storeObj = await storeModel.findById(storeId);
      const populatedStore = await storeObj.populate('products').execPopulate();
      const productsDoc = populatedStore._doc.products;
      return res.status(200).json(productsDoc);
    }

    // product id was set, return the product
    const product = await productModel.findById(productId);
    const productDoc = product._doc;
    return res.status(200).json(productDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const createProduct = async (req, res) => {
  const storeId = req.decoded.store;
  const { thumbnail, name, prices, cost, count, category } = req.body;
  
  try {
    const product = new productModel({ name, prices, cost, count, category, store: storeId });

    if (thumbnail) {
      writeImageFile(thumbnail, product._id);
      product.thumbnailFlag = true;
    }

    // save product to database
    const savedProduct = await product.save();
    const savedProductDoc = savedProduct._doc;
    
    // emit add product event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'ADD_PRODUCT', payload: savedProductDoc._id, uid: req.decoded.user });

    return res.status(201).json(savedProductDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const updateProduct = async (req, res) => {
  const { _id, thumbnail, thumbnailFlag, enable, name, prices, cost, count, category } = req.body;

  if (!_id) {
    return res.status(400).json('Product ID is required');
  }

  try {
    const updatedProduct = await productModel.findByIdAndUpdate(_id, {
      thumbnailFlag: (thumbnailFlag || thumbnail ? true: false ),
      enable,
      name,
      prices,
      cost,
      count,
      category
    }, { new: true });

    if (thumbnail) {
      writeImageFile(thumbnail, updatedProduct._id);
    }

    const updatedProductDoc = updatedProduct._doc;

    // emit update product event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'UPDATE_PRODUCT', payload: updatedProductDoc._id, uid: req.decoded.user });

    return res.status(200).json(updatedProductDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const deleteProduct = async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    return res.status(400).json('Product ID is required');
  }

  try {
    // find product by id
    const product = await productModel.findById(_id);
    // delete current product
    await product.deleteOne();
    // remove product image
    removeImageFile(_id);

    // emit delete product event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'DELETE_PRODUCT', payload: _id, uid: req.decoded.user });

    return res.status(204).json(_id);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const restockProduct = async (req, res) => {
  const { _id, count } = req.body;

  if (!_id) {
    return res.status(400).json('Product ID is required');
  }

  try {
    const productObj = await productModel.findById(_id);
    productObj.count += count;
    const savedProduct = await productObj.save();
    const productDoc = savedProduct._doc;

    // emit update product event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'UPDATE_PRODUCT', payload: productDoc._id, uid: req.decoded.user });

    return res.status(200).json(productDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  restockProduct,
}
