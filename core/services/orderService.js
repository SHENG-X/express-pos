const orderModel = require('../model/orderModel');
const productModel = require('../model/productModel');
const userModel = require('../model/userModel');

const getOrder = async (req, res) => {
  const storeId = req.decoded.store;

  const { oid, startDate, endDate } = req.query;

  try {
    if (!oid) {
      let orders;
      // no order id is set, return all orders belong to the store
      // according to selected date range
      if (!startDate && !endDate) {
        // if start date and end date is not set
        // send all orders back
        orders = await orderModel.find({ store: storeId });
      } else {
        orders = await orderModel.find({ store: storeId, createdAt: {"$gte": new Date(startDate), "$lt": new Date(endDate)} });
      }
      const ordersDoc = orders.map(ord => ord._doc);
      return res.status(200).json(ordersDoc); 
    }

    // order id is set, return the order
    const orderObj = await orderModel.findById(oid);
    const orderObjDoc = orderObj._doc;
    return res.status(200).json(orderObjDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const createOrder = async (req, res) => {
  const storeId = req.decoded.store;
  const userId = req.decoded.user;

  const { products, paymentType, amountPaid, taxRate, discount } = req.body;

  try {
    // create a order object and save it to the database
    const cashierNo = await userModel.findById(userId);
    const orderObj = new orderModel({ products, paymentType, amountPaid, taxRate, discount, store: storeId, processedBy: cashierNo.staffNo });
    const savedOrder = await orderObj.save();
    const savedOrderDoc = savedOrder._doc;

    // emit add order event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(storeId, { type: 'ADD_ORDER', payload: savedOrderDoc._id, uid: req.decoded.user });

    // loop through order products and emit product updated message
    savedOrder.products.forEach(prod => {
      res.io.emit(storeId, { type: 'ALTER_PRODUCT', payload: prod.product, uid: req.decoded.user });
    });

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
    const order = await orderModel.findById(_id);
    const products = order.products;
    await order.deleteOne();

    // loop through all products in the order
    products.forEach(async (prod) => {
      const prodObj = await productModel.findById(prod.product);
      // increase product count
      prodObj.count += prod.count;
      // decrease product sold
      prodObj.sold -= prod.count;
      await prodObj.save();
      // emit product changed message
      res.io.emit(storeId, { type: 'ALTER_PRODUCT', payload: prodObj.id, uid: req.decoded.user });
    });

    // emit delete order event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(storeId, { type: 'DELETE_ORDER', payload: _id, uid: req.decoded.user });

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
