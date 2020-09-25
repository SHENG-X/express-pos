const StoreModel = require('../model/storeModel');

const getTax = async (req, res) => {
  try {
    const store = await StoreModel.findById(req.decoded.store);
    return res.status(200).json(store._doc.tax);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateTax = async (req, res) => {
  const storeId = req.decoded.store;
  const { tax } = req.body;
  try {
    const updatedStore = await StoreModel.findByIdAndUpdate(storeId, { tax }, { new: true });
    const updatedTaxDoc = updatedStore._doc.tax;

    // emit update tax event to according store so all users in the same store
    // can react to the event accordingly
    res.io.emit(storeId, { type: 'UPDATE_TAX', payload: storeId, uid: req.decoded.user });

    return res.status(200).json(updatedTaxDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getTax,
  updateTax,
};
