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

import { Context } from '../../../../context/storeContext';
import { classNames } from '../../../../utils';

const Categories = ({ selectedCID, handleSelectChange }) => {
  const { storeState } = useContext(Context);
  const [activeCategories, setActiveCategories] = useState([]);

  useEffect(() => {
    setActiveCategories(computeActiveCategory());
  }, []);

  const selectCategory = (cid) => {
    handleSelectChange(cid);
  }

  const computeActiveCategory = () => {
    // filter categories to get categories that were used by
    // products, if a category is not used then we don't want to display it
    let activeCategoryIDs = new Set();
    storeState.products.forEach(prod => {
      if (prod.category) {
        activeCategoryIDs.add(prod.category);
      }
    });
    activeCategoryIDs = [...activeCategoryIDs];
    const activeCategories = activeCategoryIDs.map(cid => {
      return storeState.categories.find(category => category._id === cid);
    });
    return activeCategories.filter(category => category);
  }

  return (
    <React.Fragment>
      {
        !!activeCategories.length &&
        <Paper
          elevation={3}
          className="categories-list"
        > 
          <div className="icon">
            <Category/>
          </div>
          { activeCategories.map(category => (category && <CategoryItem category={category} selectedCID={selectedCID} selectCategory={selectCategory} key={category._id}/>)) }
        </Paper>
      }
    </React.Fragment>
  );
}

const CategoryItem = ({ category, selectedCID, selectCategory }) => {
  return (
    <ButtonBase
      className="category-item"
      onClick={() => selectCategory(category._id)}
    >
      <div className="label">
        { category.name }
      </div>
      <div className={ classNames(["indicator", category._id === selectedCID ? 'selected': ''])}/>
    </ButtonBase>
  );
}

export default Categories;
