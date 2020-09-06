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

const createCategory = async (req, res) => {
  const storeId = req.decoded.store;
  const { thumbnail, name } = req.body;

  const category = new categoryModel({ thumbnail, name, store: storeId });
  const storeObj = await storeModel.findById(storeId);
  
  try {
    // save category
    const savedCategory = await category.save();
    // append the saved category to the store
    storeObj.categories.push(savedCategory._id);
    // update store
    await storeObj.save();

    const savedCategoryDoc = savedCategory._doc;
    return res.status(201).json(savedCategoryDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const updateCategory = async (req, res) => {
  const { _id, thumbnail = '', name } = req.body;
  try {
    const updatedCategory = await categoryModel.findByIdAndUpdate(_id, {thumbnail, name}, {new: true});
    const updateCategoryDoc = updatedCategory._doc;
    return res.status(200).json(updateCategoryDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const deleteCategory = async (req, res) => {
  const storeId = req.decoded.store;
  const { _id } = req.query;

  try {
    // delete from category table
    await categoryModel.findByIdAndDelete(_id);
    // remove the ref key from store categories
    const store = await storeModel.findById(storeId);
    store.categories = store.categories.filter(cid => cid.toString() !== _id);
    await store.save();
    return res.status(204).json(_id);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
