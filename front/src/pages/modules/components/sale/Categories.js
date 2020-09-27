import React, {
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  Paper,
  ButtonBase,
} from '@material-ui/core';
import {
  Category,
} from '@material-ui/icons';
import PropTypes from 'prop-types';

import { Context } from '../../../../context/storeContext';
import { classNames } from '../../../../utils';

const Categories = ({ selectedCID, handleSelectChange }) => {
  const { storeState } = useContext(Context);
  const [activeCategories, setActiveCategories] = useState([]);

  const selectCategory = (cid) => {
    handleSelectChange(cid);
  };

  const computeActiveCategory = () => {
    // filter categories to get categories that were used by
    // products, if a category is not used then we don't want to display it
    let activeCategoryIDs = new Set();
    storeState.products.forEach((prod) => {
      if (prod.category && prod.enable) {
        activeCategoryIDs.add(prod.category);
      }
    });
    activeCategoryIDs = [...activeCategoryIDs];
    const currentActiveCategories = activeCategoryIDs.map((cid) => storeState
      .categories.find((category) => category._id === cid));

    return currentActiveCategories.filter((category) => category);
  };

  useEffect(() => {
    setActiveCategories(computeActiveCategory());
  }, []);

  return (
    <>
      {
        !!activeCategories.length && (
          <Paper
            elevation={3}
            className="categories-list"
          >
            <div className="icon">
              <Category />
            </div>
            {
              activeCategories.map((category) => (
                category && <CategoryItem
                  category={category}
                  selectedCID={selectedCID}
                  selectCategory={selectCategory}
                  key={category._id}
                />
              ))
            }
          </Paper>
        )
      }
    </>
  );
};

const CategoryItem = ({ category, selectedCID, selectCategory }) => (
  <ButtonBase
    className="category-item"
    onClick={() => selectCategory(category._id)}
  >
    <div className="label">
      { category.name }
    </div>
    <div className={classNames(['indicator', category._id === selectedCID ? 'selected' : ''])} />
  </ButtonBase>
);

Categories.propTypes = {
  selectedCID: PropTypes.string.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
};

CategoryItem.propTypes = {
  category: PropTypes.instanceOf(PropTypes.object).isRequired,
  selectedCID: PropTypes.string.isRequired,
  selectCategory: PropTypes.func.isRequired,
};

export default Categories;
