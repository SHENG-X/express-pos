import React, {
  useState,
  useContext
} from 'react';
import {
  Paper,
  Typography,
  Button,
  Input,
  InputAdornment,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import {
  Search,
  Edit,
  Delete
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import CategoryModal from './CategoryModal';
import { Context } from '../../../../context/storeContext';
import { imagePath } from '../../../../utils';

const Category = () => {
  const { state } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const handleAdd = () => {
    setCurrentCategory(null);
    setOpen(true);
  }

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setOpen(true);
  }

  const computeList = () => {
    let categories = state.store.categories;
    if (searchText !== '') {
      categories = categories.filter(category => category.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    return categories.map(category => <CategoryRow category={category} handleEdit={handleEdit} key={category._id} />);
  }

  return (
    <React.Fragment>
      <Paper>
        <div className="category-tab">
          <div className="heading">
            <Typography variant="subtitle1">
              { t('category.heading') }
            </Typography>
          </div>
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
                placeholder={ t('category.search') }
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                onChange={e => setSearchText(e.target.value)}
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
        </div>
      </Paper>
      {
        open ?
        <CategoryModal handleOpen={val => setOpen(val)} initCategory={currentCategory}/>
        :
        null
      }
    </React.Fragment>
  );
}

const CategoryRow = ({ category, handleEdit }) => {
  const { state, deleteCategory } = useContext(Context);

  const productCount = () => {
    return state.store.products.reduce((acc, cur) => {
      if (cur.category === category._id) {
        return acc + 1;
      }
      return acc + 0;
    }, 0);
  }

  return (
    <TableRow>
      <TableCell key={category.key}>
        {
          category.thumbnailFlag ?
          <div
            className="thumbnail"
            title={category.name}
            style={{"backgroundImage": `url(${imagePath(category._id)})`}}
          />
          :
          <div
            className="thumbnail"
            title={category.name}
            style={{"backgroundImage": `url(/static/media/no-product-image.b51a7162.png)`}}
          />
        }
      </TableCell>
      <TableCell>
        { category.name }
      </TableCell>
      <TableCell>
        { productCount() }
      </TableCell>
      <TableCell>
        <IconButton
            color="primary"
            size="small"
            onClick={() => handleEdit(category)}
          >
            <Edit />
          </IconButton>
        <IconButton
          color="primary"
          size="small"
          onClick={() => deleteCategory(
            { _id: category._id },
            () => {
              // TODO: handle success
            },
            () => {
              // TODO: handle failed
            }
          )}
        >
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default Category;
