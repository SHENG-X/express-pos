const storeModel = require('../model/storeModel');

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
  updateTax,
}
