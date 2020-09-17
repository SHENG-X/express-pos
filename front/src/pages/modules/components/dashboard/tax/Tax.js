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
import { useToasts } from 'react-toast-notifications';

import { Context } from '../../../../../context/storeContext';
import CardBase from '../../cardbase/CardBase';

const Tax = () => {
  const { storeState, updateTax } = useContext(Context);
  const { t } = useTranslation();
  const [tax, setTax] = useState({ ...storeState.tax, rate: (storeState.tax.rate * 100).toString().replace(/^0+/,'')});
  const [allowUpdate, setAllowUpdate] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => {
    if (tax.enable !== storeState.tax.enable || tax.rate !== (storeState.tax.rate * 100).toString().replace(/^0+/,'')) {
      setAllowUpdate(true);
    } else {
      setAllowUpdate(false);
    }
  }, [tax]);

  useEffect(() => {
    // watch store tax change on tax change
    // set component tax to store tax
    setTax({ ...storeState.tax, rate: (storeState.tax.rate * 100).toString().replace(/^0+/,'')});
  }, [storeState.tax])

  const handleCancel = () => {
    setAllowUpdate(false);
    setTax({ ...storeState.tax, rate: (storeState.tax.rate * 100).toString().replace(/^0+/,'')});
  }

  const handleConfirm = () => {
    updateTax(
      { ...tax, rate: tax.rate / 100 },
      () => {
        setAllowUpdate(false);
        addToast('Tax setting updated', {appearance: 'success'});
      },
      () => {
        addToast('Unable to update tax setting, please try again later', { appearance: 'error' });
      }
    );
  }

  return (
    <CardBase
      title={'Tax'}
      className="tax-tab"
    >
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
            onChange={e => setTax({...tax, rate: e.target.value.replace(/^0+/,'')})}
            inputProps={{step: 1}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  %
                </InputAdornment>
              ),
              inputProps: { 
                min: 0,
              }
            }}
          />
        </div>
      </div>
      {
        allowUpdate &&
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
      }
    </CardBase>
  );
}

export default Tax;
