import React, {
  useState
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

const categoryMock = [
  {
    _id: '7850273978401739',
    name: 'Nike',
    prodCount: 100
  },
  {
    _id: '7481937590759372',
    name: 'Adidas',
    prodCount: 50
  }
]

const Category = ({ handleOpen }) => {
  const [categories, setCategories] = useState(categoryMock);

  return (
    <Paper>
      <div className="category-tab">
        <div className="heading">
          <Typography variant="subtitle1">
            Product category
          </Typography>
        </div>
        <div className="actions">
          <Button
            // onClick={() => handleOpen(true)}
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
              categories.map(category => <CategoryRow category={category} key={category._id} />)
            }
          </div>
        </div>
      </div>
    </Paper>
  );
}

const CategoryRow = ({ category }) => {
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
        { category.count }
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
        >
          <Delete />
        </IconButton>
      </div>
    </div>
  );
}

export default Category;
