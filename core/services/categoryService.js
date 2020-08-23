const categoryModel = require('../model/categoryModel');
const storeModel = require('../model/storeModel');

const getCategory = (req, res) => {
  const store = req.query.store;
  const categoryId = req.query.id;
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

    if (categoryId) {
      // category id was set, then fetch single category by id
      return categoryModel.findById(categoryId, (error, category) => {
        if (error) {
          return res.status(500).json(error);
        }
  
        if (category) {
          return res.status(200).json(category); 
        }
  
        return res.status(404).json(null);
      });
    }
  
    return categoryModel.find({}, (error, categories) => {
      if (error) {
        return res.status(500).json(error);
      }
      // send all categories as response
      return res.status(200).json(categories);
    });
  });

}

const createCategory = (req, res) => {
  const { thumbnail, name, store } = req.body;
  // check if it is a valid store
  return storeModel.findById(store, (error, storeData) => {
    if (error) {
      return res.status(500).json(error);
    }
    if (!storeData) {
      // store is invalid
      return res.status(400).json(storeData);
    }
    // TODO: do not allow duplicated category
    // validate by store and name
    const category = new categoryModel({ thumbnail, name, store});
    return category.save((error, categoryData) => {
      if (error) {
        res.status(500).json(error);
      }

      return res.status(201).json(categoryData._doc);
    });
  });
}

const updateCategory = (req, res) => {

}

const deleteCategory = (req, res) => {

}

module.exports = {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
