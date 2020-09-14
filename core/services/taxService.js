const storeModel = require('../model/storeModel');

const updateTax = async (req, res) => {
  const storeId = req.decoded.store;
  const { tax } = req.body;
  try {
    const updatedStore = await storeModel.findByIdAndUpdate(storeId, { tax }, { new : true });
    const updatedTaxDoc = updatedStore._doc.tax;
    return res.status(200).json(updatedTaxDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  updateTax,
}
