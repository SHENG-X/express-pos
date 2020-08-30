const categoryModel = require('../model/categoryModel');
const storeModel = require('../model/storeModel');

const getCategory = (req, res) => {
  const store = req.query.store;
  const categoryId = req.query.id;
  if (!store || !categoryId) {
    return res.status(400).json({ store, categoryId });
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
  
        if (!category) {
          return res.status(400).json(category);
        }
        return res.status(200).json(category); 
  
      });
    }
  
    return categoryModel.find({ store }, (error, categories) => {
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
        return res.status(500).json(error);
      }

      // add category to the store categories
      storeData.categories.push(categoryData._id);

      return storeData.save((error) => {
        if (error) {
          return res.status(500).json(error);
        }

        return res.status(201).json(categoryData._doc);
      });

    });
  });
}

const updateCategory = (req, res) => {
  const { _id, thumbnail = '', name } = req.body;
  return categoryModel.findById(_id, (error, categoryData) => {
    if (error) {
      return res.status(500).json(error);
    }
    
    if (!categoryData) {
      // requested category not found
      return res.status(400).json(categoryData);
    }

    categoryData.thumbnail = thumbnail;
    categoryData.name = name;

    return categoryData.save((error, categoryData) => {
      if (error) {
        return res.status(500).json(error);
      }
      return res.status(200).json(categoryData._doc);
    });
  });
}

const deleteCategory = (req, res) => {
  const { store, _id } = req.query;
  return categoryModel.deleteOne({ _id }, (error) => {
    if (error) {
      return res.status(500).json(error);
    }

    return storeModel.findById(store, (error, storeData) => {
      if (error) {
        return res.status(500).json(error);
      }

      storeData.categories = storeData.categories.filters(category => category._id !== _id);
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
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
