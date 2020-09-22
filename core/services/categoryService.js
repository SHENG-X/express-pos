const uuid = require('uuid'); 

const { writeImageFile, removeImageFile } = require('../utils');
const categoryModel = require('../model/categoryModel');
const storeModel = require('../model/storeModel');

const getCategory = async (req, res) => {
  const storeId = req.decoded.store; 
  // const store = req.query.store;
  const categoryId = req.query.cid;

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
  let imgFileName;
  const category = new categoryModel({ name, store: storeId });

  if (thumbnail) {
    imgFileName = uuid.v4();
    category.thumbnailFileName = imgFileName;
    writeImageFile(thumbnail, imgFileName);
  }

  try {
    // save category
    const savedCategory = await category.save();
    const savedCategoryDoc = savedCategory._doc;

    // emit add category event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(storeId, { type: 'ADD_CATEGORY', payload: savedCategoryDoc._id, uid: req.decoded.user });

    return res.status(201).json(savedCategoryDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const updateCategory = async (req, res) => {
  const { _id, thumbnail, name } = req.body;
  try {
    let imgFileName;
    const category = await categoryModel.findById(_id);
    category.name = name;
    if (thumbnail) {
      if (category.thumbnailFileName) {
        // if there is previous thumbnail then remove it
        removeImageFile(category.thumbnailFileName);
      }
      imgFileName = uuid.v4();
      category.thumbnailFileName = imgFileName;
      writeImageFile(thumbnail, imgFileName);
    }
    const updatedCategory = await category.save();

    const updateCategoryDoc = updatedCategory._doc;

    // emit update category event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'UPDATE_CATEGORY', payload: updateCategoryDoc._id, uid: req.decoded.user });

    return res.status(200).json(updateCategoryDoc);
  } catch (error) {
    return res.status(500).json(error);
  }
}

const deleteCategory = async (req, res) => {
  const { _id } = req.query;

  try {
    // find category by id
    const category = await categoryModel.findById(_id);
    // remove category thumbnail
    removeImageFile(category.thumbnailFileName);
    // remove the category
    await category.deleteOne();
    
    // emit update category event to according store so all users in the same store 
    // can react to the event accordingly
    res.io.emit(req.decoded.store, { type: 'DELETE_CATEGORY', payload: _id, uid: req.decoded.user });

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
