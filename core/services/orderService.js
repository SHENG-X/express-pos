const storeModel = require('../model/storeModel');
const orderModel = require('../model/orderModel');

const getOrder = (req, res) => {
  const store = req.query.store;
  const orderId = req.query.id;

  if (!store || !orderId) {
    return res.status(400).json({ store, orderId });
  }

  return storeModel.findById(store, (error, storeData) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!storeData) {
      return res.status(400).json(storeData);
    }

    if (orderId) {
      return orderModel.findById(orderId, (error, orderData) => {
        if (error) {
          return res.status(500).json(error);
        }

        if (!orderData) {
          return res.status(404).json(orderData);
        }
        
        return res.status(200).json(orderData);
      })
    }

    return orderModel.find({ store }, (error, orders) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(orders);
    });
  });

}

const createOrder = (req, res) => {
  const { store, products, paymentType, amountPaid } = req.body;
  return storeModel.findById(store, (error, storeData) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!storeData) {
      return res.status(404).json(storeData);
    }

    const order = new orderModel({ store, products, paymentType, amountPaid });
    return order.save((error, orderData) => {
      if (error) {
        return res.status(500).json(error);
      }

      // add order to store orders
      storeData.orders = [...storeData.orders, orderData._id];

      return storeData.save((error) => {
        if (error) {
          return res.status(500).json(error);
        }
        return res.status(201).json(orderData);
      });
    });
  });
}

const updateOrder = (req, res) => {
  const { _id, products } = req.body;
  return orderModel.findById(_id, (error, order) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!order) {
      return res.status(400).json(order);
    }

    order.products = products;
    return order.save((error, order) => {
      if (error) {
        return res.status(500).json(error);
      }

      return res.status(200).json(order);
    });
  });
}

const deleteOrder = (req, res) => {
  const { store, _id } = req.body;
  return orderModel.deleteOne({ _id }, (error) => {
    if (error) {
      return res.status(500).json(error);
    }
    return storeModel.findById(store, (error, storeData) => {
      if (error) {
        return res.status(500).json(error);
      }
      // update store data orders
      storeData.orders = storeData.orders.filter(order => order.toString() !== _id);
      return storeData.save((error) => {
        if (error) {
          return res.status(500).json(error);
        }
        return res.status(204).json(_id);
      });
    });
  });
}

module.exports = {
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
}
