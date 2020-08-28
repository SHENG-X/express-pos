import React, {
  useState,
  useContext
} from 'react';
import {
  Paper,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import { Context } from '../../../../context/storeContext';

const Tax = () => {
  const { state, updateTax } = useContext(Context);

  return (
    <Paper elevation={3}>
      <div className="tax-tab">
          <div className="heading">
            <Typography variant="subtitle1">
              Tax
            </Typography>
          </div>
          <div className="content">
            <div className="row">
              <div className="label">
                <Typography variant="subtitle1">
                  Enable
                </Typography>
              </div>
              <div className="input">
                <Switch
                  checked={state.tax.enable}
                  onChange={(e, val) => updateTax({...state.tax, enable: val})}
                  color="primary"
                  name="Tax enable"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div>
            </div>
            <div className="row">
              <div className="label">
                <Typography variant="subtitle1">
                  Rate
                </Typography>
              </div>
              <div className="input">
                <TextField
                  required
                  type="number"
                  placeholder="Tax rate"
                  value={state.tax.rate}
                  onChange={e => updateTax({...state.tax, rate: e.target.value})}
                  inputProps={{step: 0.01}}
                />
              </div>
            </div>
          </div>
      </div>
    </Paper>
  );
}

export default Tax;
