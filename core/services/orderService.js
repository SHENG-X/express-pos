const storeModel = require('../model/storeModel');
const orderModel = require('../model/orderModel');
const { populate } = require('../model/storeModel');

const getOrder = async (req, res) => {
  const storeId = req.decoded.store;

  const store = req.query.store;
  const orderId = req.query.id;

  try {
    if (!orderId) {
      // no order id is set, return all orders belong to the store
      const storeObj = await storeModel.findById(storeId);
      const populatedStore = await storeObj.populate('orders').execPopulate();
      const populatedOrdersDoc = populatedStore._doc.orders;
      return res.status(200).json(populatedOrdersDoc); 
    }

    // order id is set, return the order
    const orderObj = await orderModel.findById(orderId);
    const orderObjDoc = orderObj._doc;
    return res.status(200).json(orderObjDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const createOrder = async (req, res) => {
  const storeId = req.decoded.store;
  const { products, paymentType, amountPaid, taxRate } = req.body;

  try {
    // create a order object and save it to the database
    const orderObj = new orderModel({ products, paymentType, amountPaid, taxRate, store: storeId });
    const storeObj = await storeModel.findById(storeId);
    const savedOrder = await orderObj.save();
    // add the order to the store orders
    storeObj.orders.push(savedOrder._id);
    await storeObj.save();
    const savedOrderDoc = savedOrder._doc;
    return res.status(201).json(savedOrderDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const deleteOrder = async (req, res) => {
  const storeId = req.decoded.store;
  const { _id } = req.query;

  if (!_id) {
    return res.status(400).json('Order ID is required');
  }

  try {
    // delete order from order table
    await orderModel.findByIdAndDelete(_id);
    // remove the order ref from the store orders
    const storeObj = await storeModel.findById(storeId);
    storeObj.orders = storeObj.orders.filter(odr => odr.toString() !== _id);
    await storeObj.save();
    return res.status(204).json(_id);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getOrder,
  createOrder,
  deleteOrder,
}
