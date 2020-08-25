const productModel = require('../model/productModel');
const storeModel = require('../model/storeModel');
const categoryModel = require('../model/categoryModel');

const getProduct = (req, res) => {
  const store = req.query.store;
  const productId = req.query.id;
  
  if (!store || !productId) {
    return res.status(400).json({ store, productId });
  }

  return storeModel.findById(store, (error, storeData) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!storeData) {
      return res.status(400).json(storeData);
    }

    if (productId) {
      // if product id is set, get the product
      return productModel.findById(productId, (error, product) => {
        if (error) {
          return res.status(500).json(error);
        }
        
        if (!product) {
          return res.status(400).json(product);
        }

        return res.status(200).json(product);
      });
    }
  
    // return all products 
    return productModel.find({ store }, (error, products) => {
      if (error) {
        return res.status(500).json(error);
      }
        return res.status(200).json(products);
    });
  });

  
}

const createProduct = (req, res) => {
  const { thumbnail, name, price, cost, count, category, store } = req.body;

  if (!store) {
    return res.status(400).json(store);
  }

  return storeModel.findById(store, (error, storeData) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!storeData) {
      return res.status(400).json(storeData);
    }

    if (category) {
      // if category is entered, check if category exist
      return categoryModel.findById(category, (error, categoryData) => {
        if (error) {
          return res.status(500).json(error);
        }

        if (!categoryData) {
          return res.status(400).json(categoryData);
        }

        const product = new productModel({ thumbnail, name, price, cost, count, category, store });
        return product.save((error, productData) => {
          if (error) {
            return res.status(500).json(error);
          }
          
          if (!productData) {
            return res.status(400).json(productData);
          }

          // add new product to store products
          storeData.products.push(productData._id);
          return storeData.save((error) => {
            if (error) {
              return res.status(500).json(error);
            }

            return res.status(201).json(productData._doc);
          });
        });
      });
    }
    const product = new productModel({ thumbnail, name, price, cost, count, category, store });
    return product.save((error, productData) => {
      if (error) {
        return res.status(500).json(error);
      }
      
      if (!productData) {
        return res.status(400).json(productData);
      }

      // add new product to store products
      storeData.products.push(productData._id);
      return storeData.save((error) => {
        if (error) {
          return res.status(500).json(error);
        }

        return res.status(201).json(productData._doc);
      });
    });
  });

}

const updateProduct = (req, res) => {
  const { _id, thumbnail = '', name, prices, cost, count, category } = req.body;
  
  if (!_id) {
    return res.status(400).json(_id);
  }

  return productModel.findById(_id, (error, productData) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (!productData) {
      return res.status(400).json(productData);
    }

    // update product detail
    productData.thumbnail = thumbnail;
    productData.name = name;
    productData.prices = prices;
    productData.cost = cost;
    productData.count = count;
    productData.category = category;

    return productData.save((error, productData) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(productData._doc);
    });
  });
}

const deleteProduct = (req, res) => {
  const { store, _id } = req.body;
  return productModel.deleteOne({ _id }, (error) => {
    if (error) {
      return res.status(500).json(error);
    }
    return storeModel.findById(store, (error, storeData)  => {
      if (error) {
        return res.status(500).json(error);
      }

      storeData.products = storeData.products.filter(product => product._id !==  _id);
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
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
