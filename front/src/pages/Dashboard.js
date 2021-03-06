import React, {
  useState,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import {
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';
import {
  useHistory,
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
import { Context as UserContext } from '../context/userContext';

const Dashboard = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { userState } = useContext(UserContext);
  let tabIdx = 2;
  if (userState.role === 'Employee') {
    tabIdx = 9;
  }
  const [value, setValue] = useState(tabIdx);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="dashboard">
      <>
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
              <Tab label={t('sale.heading')} onClick={() => history.push('/sale')} />
              <div className="heading">
                <Typography variant="subtitle1">
                  { t('store.heading') }
                </Typography>
              </div>
              <Tab
                label={t('product.heading')}
                className="sub-item"
                disabled={userState.role === 'Employee'}
              />
              <Tab
                label={t('category.heading')}
                className="sub-item"
                disabled={userState.role === 'Employee'}
              />
              <Tab
                label={t('tax.heading')}
                className="sub-item"
                disabled={userState.role === 'Employee'}
              />
              <div className="heading">
                <Typography variant="subtitle1">
                  { t('report.heading') }
                </Typography>
              </div>
              <Tab
                label={t('sale.heading')}
                className="sub-item"
                disabled={userState.role === 'Employee'}
              />
              <Tab
                label={t('inventory.heading')}
                className="sub-item"
                disabled={userState.role === 'Employee'}
              />
              <div className="heading">
                <Typography variant="subtitle1">
                  User
                </Typography>
              </div>
              <Tab
                label="Profile "
                className="sub-item"
              />
              <Tab
                label="Staff"
                className="sub-item"
              />
            </Tabs>
          </div>
          <div className="right">
            <TabPanel value={value} index={2} className="tab-panel-product">
              <Product />
            </TabPanel>
            <TabPanel value={value} index={3} className="tab-panel-category">
              <Category />
            </TabPanel>
            <TabPanel value={value} index={4} className="tab-panel-tax">
              <Tax />
            </TabPanel>
            <TabPanel value={value} index={6} className="tab-panel-report--sale">
              <SaleReport />
            </TabPanel>
            <TabPanel value={value} index={7} className="tab-panel-report--inventory">
              <InventoryReport />
            </TabPanel>
            <TabPanel value={value} index={9} className="tab-panel-user--profile">
              <Profile />
            </TabPanel>
            <TabPanel value={value} index={10} className="tab-panel-user--users">
              <Staff />
            </TabPanel>
          </div>
        </div>
      </>
    </div>
  );
};

const TabPanel = ({
  children,
  index,
  value,
  className,
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    className={classNames(['tab-panel', className])}
  >
    {value === index && (
      <>
        {children}
      </>
    )}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};

TabPanel.defaultProps = {
  className: '',
};

export default withRoot(Dashboard);
