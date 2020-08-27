import React, {
  useState
} from 'react';
import {
  Tabs,
  Tab,
  Grid,
  Typography,
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
  const history = useHistory();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
              <Product/>
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

export default withRoot(Dashboard);
