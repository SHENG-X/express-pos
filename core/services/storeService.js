const StoreModel = require('../model/storeModel');

const populateStore = async (store) => {
  let populatedStore = null;
  // populate categories
  populatedStore = await store.populate('categories').execPopulate();
  // populate products
  populatedStore = await store.populate('products').execPopulate();

  return populatedStore;
};

const getStore = async (req, res) => {
  const storeId = req.decoded.store;
  try {
    const storeObj = await StoreModel.findById(storeId);
    const populatedStore = await populateStore(storeObj);
    const storeDoc = { ...populatedStore._doc };
    return res.status(200).json(storeDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getStore,
};
