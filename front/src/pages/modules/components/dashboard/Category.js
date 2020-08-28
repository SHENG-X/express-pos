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
  IconButton
} from '@material-ui/core';
import {
  Search,
  Edit,
  Delete
} from '@material-ui/icons';
import CategoryModal from './CategoryModal';
import { Context } from '../../../../context/storeContext';

const Category = ({ handleOpen }) => {
  const { state } = useContext(Context);
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <Paper>
        <div className="category-tab">
          <div className="heading">
            <Typography variant="subtitle1">
              Product category
            </Typography>
          </div>
          <div className="actions">
            <Button
              onClick={() => setOpen(true)}
            >
              Add new category
            </Button>
            <div className="search">
              <Input
                placeholder="Search for a category"
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </div>
          </div>
          <div className="content">
            <div className="row heading">
              <div class="col-img">
                <Typography variant="subtitle1">
                  IMG
                </Typography>
              </div>
              <div class="col-name">
                <Typography variant="subtitle1">
                  Name
                </Typography>
              </div>
              <div class="col-count">
                <Typography variant="subtitle1">
                  Product Count
                </Typography>
              </div>
              <div class="col-actions">
                <Typography variant="subtitle1">
                  Actions
                </Typography>
              </div>
            </div>
            <div className="list">
              {
                state.categories.map(category => <CategoryRow category={category} key={category._id} />)
              }
            </div>
          </div>
        </div>
      </Paper>
      {
        open ?
        <CategoryModal handleOpen={val => setOpen(val)} />
        :
        null
      }
    </React.Fragment>
  );
}

const CategoryRow = ({ category }) => {
  const { deleteCategory } = useContext(Context);

  return (
    <div className="row">
      <div className="col-img">
        <div
          className=""
          title={category.name}
          style={{"backgroundImage": `url(/static/media/no-product-image.b51a7162.png)`}}
        />
      </div>
      <div className="col-name">
        { category.name }
      </div>
      <div className="col-count">
        { category.prodCount }
      </div>
      <div className="col-actions">
        <IconButton
          color="primary"
          size="small"
        >
          <Edit />
        </IconButton>
        <IconButton
          color="primary"
          size="small"
          onClick={() => deleteCategory(category._id)}
        >
          <Delete />
        </IconButton>
      </div>
    </div>
  );
}

export default Category;
