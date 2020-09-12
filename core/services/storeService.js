const storeModel = require('../model/storeModel');

const populateStore = async (store) => {
  // populate categories
  store = await store.populate('categories').execPopulate();
  // populate products
  store = await store.populate('products').execPopulate();
  // populate orders
  store = await store.populate('orders').execPopulate();

  return store;
}

const getStore = async (req, res) => {
  const storeId = req.decoded.store;
  try {
    const storeObj = await storeModel.findById(storeId);
    const populatedStore = await populateStore(storeObj);
    const storeDoc = { ...populatedStore._doc };
    return res.status(200).json(storeDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getStore,
}
