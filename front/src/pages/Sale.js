import React from 'react';
import {
  Grid,
  makeStyles
} from '@material-ui/core';

import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';
import Receipt from './modules/components/Receipt';
import Products from './modules/components/Products';

const Sale = () => {
  return (
    <div className="sale" >
      <React.Fragment>
        <AppAppBar />
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Receipt/>
            </Grid>
            <Grid item xs={8}>
              <Products/>
            </Grid>
          </Grid>
      </React.Fragment>
    </div>
  );
}

export default withRoot(Sale);
