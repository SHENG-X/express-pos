import React, {
  useContext
} from 'react';
import {
  Paper,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../context/storeContext';

const Tax = () => {
  const { state, updateTax } = useContext(Context);
  const { t } = useTranslation();

  return (
    <Paper elevation={3}>
      <div className="tax-tab">
          <div className="heading">
            <Typography variant="subtitle1">
              { t('tax.heading') }
            </Typography>
          </div>
          <div className="content">
            <div className="row">
              <div className="label">
                <Typography variant="subtitle1">
                  { t('common.enable') }
                </Typography>
              </div>
              <div className="input">
                <Switch
                  checked={state.store.tax.enable}
                  onChange={(e, val) => updateTax({tax: {...state.store.tax, enable: val}, store: state.store._id})}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div>
            </div>
            <div className="row">
              <div className="label">
                <Typography variant="subtitle1">
                  { t('tax.rate') }
                </Typography>
              </div>
              <div className="input">
                <TextField
                  required
                  type="number"
                  placeholder={ t('tax.taxRate') }
                  value={state.store.tax.rate}
                  onChange={e => updateTax({ tax: {...state.store.tax, rate: e.target.value}, store: state.store._id})}
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
