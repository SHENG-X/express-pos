const categoryModel = require('../model/categoryModel');

const getCategory = (req, res) => {
  const categoryId = req.query.id;
  if (categoryId) {
    // category id was set, then fetch single category by id
    return categoryModel.find({_id: categoryId}, (error, category) => {
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

}

const createCategory = (req, res) => {
  const { thumbnail, name } = req.body;
  const category = new categoryModel({ thumbnail, name });
  return category.save((error, category)=> {
    if (error) {
      res.status(500).json(error);
    }
    return res.status(201).json(category._doc);
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