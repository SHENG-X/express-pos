const categoryModel = require('../model/categoryModel');
const storeModel = require('../model/storeModel');

const getCategory = async (req, res) => {
  const storeId = req.decoded.store; 
  // const store = req.query.store;
  const categoryId = req.query.id;

  try {
    if (!categoryId) {
      // no category id then return all categories belong to the store
      const storeObj = await storeModel.findById(storeId);
      const populatedStore = await storeObj.populate('categories').execPopulate();
      const categories = populatedStore._doc.categories;
      // send all categories back to the client
      return res.status(200).json(categories);
    }

    // category id is set, return the category
    const category = await categoryModel.findById(categoryId);
    const categoryDoc = category._doc;
    return res.status(200).json(categoryDoc); 
  } catch (error) {
    return res.status(500).json(error);
  }
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
