const productModel = require('../model/productModel');
const storeModel = require('../model/storeModel');
const categoryModel = require('../model/categoryModel');

const getProduct = async (req, res) => {
  const storeId = req.decoded.store;
  const productId = req.query.id;

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
    const product = new productModel({ thumbnail, name, prices, cost, count, category, store: storeId });
    // save product to database
    const savedProduct = await product.save();
    // append new product id to store products and save
    const storeObj = await storeModel.findById(storeId);
    storeObj.products.push(savedProduct._id);
    await storeObj.save();
    const savedProductDoc = savedProduct._doc;
    return res.status(201).json(savedProductDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const updateProduct = async (req, res) => {
  const { _id, thumbnail = '', enable, name, prices, cost, count, category } = req.body;

  if (!_id) {
    return res.status(400).json('Product ID is required');
  }

  try {
    const updatedProduct = await productModel.findByIdAndUpdate(_id, {
      thumbnail,
      enable,
      name,
      prices,
      cost,
      count,
      category
    }, { new: true });

    const updatedProductDoc = updatedProduct._doc;
    return res.status(200).json(updatedProductDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const deleteProduct = async (req, res) => {
  const storeId = req.decoded.store;
  const { _id } = req.query;

  if (!_id) {
    return res.status(400).json('Product ID is required');
  }

  try {
    // delete the product from the product table
    await productModel.findByIdAndDelete(_id);
    const storeObj = await storeModel.findById(storeId);
    // remove the product from the store products
    storeObj.products = storeObj.products.filter(pid => pid.toString() !== _id);
    await storeObj.save();
    return res.status(204).json(_id);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const consumeProduct = async (req, res) => {
  const { _id, count } = req.body;

  if (!_id) {
    return res.status(400).json('Product ID is required');
  }

  try {
    // find product object and update product count
    const productObj = await productModel.findById(_id);
    productObj.count -= count;
    const savedProduct = await productObj.save();
    const saveProductDoc = savedProduct._doc;
    return res.status(200).json(saveProductDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  consumeProduct,
}
