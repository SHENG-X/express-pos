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
import { useTranslation } from 'react-i18next';

import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import Product from './modules/components/dashboard/product/Product';
import Tax from './modules/components/dashboard/tax/Tax';
import Category from './modules/components/dashboard/category/Category';
import SaleReport from './modules/components/dashboard/report/sale/Sale';
import InventoryReport from './modules/components/dashboard/report/inventory/Inventory';
import Staff from './modules/components/dashboard/user/Staff';
import Profile from './modules/components/dashboard/user/Profile';
import { classNames } from '../utils';

const Dashboard = () => {
  const [value, setValue] = useState(2);
  const history = useHistory();
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="dashboard">
      <React.Fragment>
        <AppAppBar />
        <div className="container">
          <div className="left">
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className="tabs"
            >
              <Tab label={ t('sale.heading') } onClick={() => history.push('/sale')}/>
              <div className="heading">
                <Typography variant="subtitle1">
                  { t('store.heading') }
                </Typography>
              </div>
              <Tab label={ t('product.heading') } className="sub-item"/>
              <Tab label={ t('category.heading') } className="sub-item"/>
              <Tab label={ t('tax.heading') } className="sub-item"/>
              <div className="heading">
                <Typography variant="subtitle1">
                  { t('report.heading') }
                </Typography>
              </div>
              <Tab label={ t('sale.heading') } className="sub-item"/>
              <Tab label={ t('inventory.heading') } className="sub-item"/>
              <div className="heading">
                <Typography variant="subtitle1">
                  { `User` }
                </Typography>
              </div>
              <Tab label={ `Profile` } className="sub-item"/>
              <Tab label={ `Staff` } className="sub-item"/>
            </Tabs>
          </div>
          <div className="right">
            <TabPanel value={value} index={2} className="tab-panel-product">
              <Product/>
            </TabPanel>
            <TabPanel value={value} index={3} className="tab-panel-category">
              <Category/>
            </TabPanel>
            <TabPanel value={value} index={4} className="tab-panel-tax">
              <Tax/>
            </TabPanel>
            <TabPanel value={value} index={6} className="tab-panel-report--sale">
              <SaleReport/>
            </TabPanel>
            <TabPanel value={value} index={7} className="tab-panel-report--inventory">
              <InventoryReport/>
            </TabPanel>
            <TabPanel value={value} index={9} className="tab-panel-user--profile">
              <Profile/>
            </TabPanel>
            <TabPanel value={value} index={10} className="tab-panel-user--users">
              <Staff/>
            </TabPanel>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
}

const TabPanel = ({ children, index, value, className = '' }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className={classNames(['tab-panel', className])}
    >
      {value === index && (
        <React.Fragment>
          {children}
        </React.Fragment>
      )}
    </div>
  );
}

export default withRoot(Dashboard);
