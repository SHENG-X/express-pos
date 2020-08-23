const storeModel = require('../model/storeModel');

const getTax = (req, res) => {
  const store = req.query.store;
  if (!store) {
    return res.status(400).json(store);
  }
  return storeModel.findById(store, (error, store) => {
    if (error) {
      return res.status(500).json(error);
    }
    return res.status(200).json(store._doc.tax);
  });
}

const updateTax = (req, res) => {
  const { store, tax } = req.body;
  return storeModel.findById(store, (error, store) => {
    if (error) {
      return res.status(500).json(error);
    }
    // update tax to new tax
    store.tax = tax;
    return store.save((error, store) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(store._doc.tax);
    });
  });
}

module.exports = {
  getTax,
  updateTax,
}
