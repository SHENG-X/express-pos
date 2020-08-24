import React from 'react';
import {
  Grid,
  Paper,
  makeStyles
} from '@material-ui/core';

import Typography from './modules/components/Typography';
import Receipt from './modules/components/Receipt';
import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: '2rem'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Sale = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} >
      <React.Fragment>
        <AppAppBar />
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Receipt/>
            </Grid>
            <Grid item xs={8}>
              <Paper className={classes.paper}>xs=8</Paper>
            </Grid>
          </Grid>
      </React.Fragment>
    </div>
  );
}

export default withRoot(Sale);
