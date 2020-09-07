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
  InputAdornment,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Context } from '../../../../context/storeContext';

const Tax = () => {
  const { state, updateTax } = useContext(Context);
  const { t } = useTranslation();
  const [tax, setTax] = useState({ ...state.store.tax, rate: Number((state.store.tax.rate * 100).toFixed(2))});
  const [allowUpdate, setAllowUpdate] = useState(false);

  useEffect(() => {
    if (tax.enable !== state.store.tax.enable || tax.rate !== Number((state.store.tax.rate * 100).toFixed(2))) {
      setAllowUpdate(true);
    } else {
      setAllowUpdate(false);
    }
  }, [tax]);

  const handleCancel = () => {
    setAllowUpdate(false);
    setTax({ ...state.store.tax, rate: Number((state.store.tax.rate * 100).toFixed(2))});
  }

  const handleConfirm = () => {
    updateTax(
      { ...tax, rate: tax.rate / 100 },
      () => {
        setAllowUpdate(false);
      },
      () => {
        // TODO: handle update failed
      }
    );
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
                  inputProps={{step: 1}}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                      </InputAdornment>
                    )
                  }}
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
