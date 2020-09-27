import React, {
  useState,
  useContext,
} from 'react';
import {
  Button,
  Input,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@material-ui/core';
import {
  Search,
  Edit,
  Delete,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';

import CategoryModal from './CategoryModal';
import { Context } from '../../../../../context/storeContext';
import { imagePath } from '../../../../../utils';
import CardBase from '../../cardbase/CardBase';

const Category = () => {
  const { storeState } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const handleAdd = () => {
    setCurrentCategory(null);
    setOpen(true);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setOpen(true);
  };

  const computeList = () => {
    let { categories } = storeState;
    if (searchText !== '') {
      categories = categories.filter((category) => (
        category.name.toLowerCase().includes(searchText.toLowerCase())
      ));
    }
    return categories.map((category) => (
      <CategoryRow
        category={category}
        handleEdit={handleEdit}
        key={category._id}
      />
    ));
  };

  return (
    <>
      <CardBase
        title={t('category.heading')}
        className="category-tab"
      >
        <div className="actions">
          <Button
            color="primary"
            variant="contained"
            onClick={handleAdd}
          >
            { t('category.addNew') }
          </Button>
          <div className="search">
            <Input
              placeholder={t('category.search')}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <div className="table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{ t('common.img') }</TableCell>
                <TableCell>{ t('common.name') }</TableCell>
                <TableCell>{ t('product.productCount') }</TableCell>
                <TableCell>{ t('common.actions') }</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { computeList() }
            </TableBody>
          </Table>
        </div>
      </CardBase>
      {
        open && (
          <CategoryModal
            handleOpen={(val) => setOpen(val)}
            initCategory={currentCategory}
          />
        )
      }
    </>
  );
};

const CategoryRow = ({ category, handleEdit }) => {
  const { storeState, deleteCategory } = useContext(Context);
  const { addToast } = useToasts();

  const productCount = () => storeState
    .products.reduce((acc, cur) => {
      if (cur.category === category._id) {
        return acc + 1;
      }
      return acc + 0;
    }, 0);

  return (
    <TableRow>
      <TableCell key={category.key}>
        {
          category.thumbnailFileName ? (
            <div
              className="thumbnail"
              title={category.name}
              style={{ backgroundImage: `url(${imagePath(category.thumbnailFileName)})` }}
            />
          ) : (
            <div
              className="thumbnail"
              title={category.name}
              style={{ backgroundImage: 'url(/static/media/no-product-image.b51a7162.png)' }}
            />
          )
        }
      </TableCell>
      <TableCell>
        { category.name }
      </TableCell>
      <TableCell>
        { productCount() }
      </TableCell>
      <TableCell>
        <Tooltip
          title="Edit"
          arrow
        >
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEdit(category)}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Delete"
          arrow
        >
          <IconButton
            color="primary"
            size="small"
            onClick={() => deleteCategory(
              { _id: category._id },
              () => {
                addToast('Category deleted', { appearance: 'success' });
              },
              () => {
                addToast('Error on deleting the category, please try again later', { appearance: 'error' });
              },
            )}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

CategoryRow.propTypes = {
  category: PropTypes.instanceOf(PropTypes.object).isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default Category;
