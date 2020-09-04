import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Paper,
  Switch,
  TextField,
  Typography,
  Button,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../context/storeContext';

const Tax = () => {
  const { state, updateTax } = useContext(Context);
  const { t } = useTranslation();
  const [tax, setTax] = useState(JSON.parse(JSON.stringify(state.store.tax)));
  const [allowUpdate, setAllowUpdate] = useState(false);

  useEffect(() => {
    if (tax.enable !== state.store.tax.enable || tax.rate !== state.store.tax.rate) {
      setAllowUpdate(true);
    } else {
      setAllowUpdate(false);
    }
  }, [tax]);

  const handleCancel = () => {
    setAllowUpdate(false);
    setTax(JSON.parse(JSON.stringify(state.store.tax)));
  }

  const handleConfirm = () => {
    updateTax({ store: state.store._id, tax }, () => {
      setAllowUpdate(false);
    });
  }

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
                  checked={tax.enable}
                  onChange={(e, val) => setTax({...tax, enable: val})}
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
                  value={tax.rate}
                  onChange={e => setTax({...tax, rate: Number(e.target.value)})}
                  inputProps={{step: 0.01}}
                />
              </div>
            </div>
            {
              allowUpdate ?
              <div className="row actions">
                <Button
                  variant="contained"
                  onClick={handleCancel}
                >
                  { t('common.cancel') }
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleConfirm}
                >
                  { t('common.confirm') }
                </Button>
              </div>
              :
              null
            }
          </div>
      </div>
    </Paper>
  );
}

export default Tax;
