import React, {
  useState
} from 'react';
import {
  Tabs,
  Tab,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import {
  useHistory
} from 'react-router-dom';
import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import Product from './modules/components/dashboard/Product';
import Tax from './modules/components/dashboard/Tax';
import Category from './modules/components/dashboard/Category';
import SaleReport from './modules/components/dashboard/Sale';
import InventoryReport from './modules/components/dashboard/Inventory';

const Dashboard = () => {
  const [value, setValue] = useState(2);
  const [productOpen, setProductOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProductConfirm = () => {

  }

  const handleProductCancel = () => {

  }

  const handleCategoryConfirm = () => {

  }

  const handleCategoryCancel = () => {

  }

  return (
    <div class="dashboard">
      <React.Fragment>
        <AppAppBar />
        <Grid container spacing={3} >
          <Grid item xs={3}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className="tabs"
            >
              <Tab label="Sale" onClick={() => history.push('/sale')}/>
              <div className="heading">
                <Typography variant="subtitle1">
                  Store Management
                </Typography>
              </div>
              <Tab label="Product" className="sub-item"/>
              <Tab label="Category" className="sub-item"/>
              <Tab label="Tax" className="sub-item"/>
              <div className="heading">
                <Typography variant="subtitle1">
                  Report
                </Typography>
              </div>
              <Tab label="Sale" className="sub-item"/>
              <Tab label="Inventory" className="sub-item"/>
            </Tabs>
          </Grid>
          <Grid item xs={9}>
            <TabPanel value={value} index={2}>
              <Product
                handleOpen={val => setProductOpen(val)}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Category/>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Tax/>
            </TabPanel>
            <TabPanel value={value} index={6}>
              <SaleReport/>
            </TabPanel>
            <TabPanel value={value} index={7}>
              <InventoryReport/>
            </TabPanel>
          </Grid>
        </Grid>
        {
          productOpen ? 
          <ProductModal handleOpen={val => setProductOpen(val)} handleConfirm={handleProductConfirm} />
          :null
        }
      </React.Fragment>
    </div>
  );
}

const TabPanel = ({ children, index, value }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className="tab-panel"
    >
      {value === index && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}

const ProductModal = ({handleOpen, handleConfirm}) => {
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState({});

  return (
    <div className="carpet product-model">
      <Paper elevation={3} className="content">
        <div className="heading">
          <Typography variant="h5">
            Add a product
          </Typography>
        </div>
        <div className="content">
          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Thumbnail
              </Typography>
            </div>
            <div className="input">

            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Name
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                placeholder="Product name"
              />
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Count
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                type="number"
                placeholder="Product count"
              />
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Category
              </Typography>
            </div>
            <div className="input">
            <FormControl variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={e => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>C1</MenuItem>
                <MenuItem value={20}>C2</MenuItem>
                <MenuItem value={30}>C3</MenuItem>
              </Select>
            </FormControl>
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Prices
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                type="number"
                placeholder="Product price"
              />
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                Cost
              </Typography>
            </div>
            <div className="input">
              <TextField
                required
                type="number"
                placeholder="Product cost"
              />
            </div>
          </div>

        </div>

        <div className="actions">
          <Button 
            onClick={() => handleOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirm(product)}
          >
            Confirm
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default withRoot(Dashboard);
