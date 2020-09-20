import React, {
  useState,
  useContext,
} from 'react';
import {
  Typography,
  TextField,
  Button,
  IconButton,
} from '@material-ui/core';
import {
  Add,
  Remove,
  ArrowForward,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';

import ModalBase from '../../ModalBase';
import { Context } from '../../../../../context/storeContext';
import MdcIntTextField from '../../../overwrite/MdcIntTextField';

const RestockModal = ({ product, handleOpen }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const  { restockProduct } = useContext(Context);
  const { addToast } = useToasts();

  const handleCancel = () => {
    handleOpen(false);
  }

  const handleConfirm = () => {
    restockProduct(
      { _id: product._id, count: amount },
      () => {
        handleOpen(false);
        addToast('Restock success', { appearance: 'success' });
      },
      () => {
        addToast('Unable to restock the product, please try again later', { appearance: 'error' });
      }
    )
  }

  const handleAdd = (increment) => {
    const updatedAmount = Number(amount) + increment;
    setAmount(updatedAmount === 0 ? '' : updatedAmount );
  }

  return (
    <ModalBase
      title="Restock"
      className="restock-modal"
      content={
        <React.Fragment>
          <div className="top">
            <div className="left">
              <div className="label">Current Stock</div>
              <div className="value">{ product.count }</div>
            </div>
            <div className="icon">
              <ArrowForward/>
            </div>
            <div className="right">
              <div className="label">New Stock</div>
              <div className="value">{ product.count + amount }</div>
            </div>
          </div>
          <div className="bottom">
            <IconButton
              variant="contained"
              size="small"
              onClick={() => handleAdd(1)}
            >
              <Add/>
            </IconButton>
            <MdcIntTextField
              value={amount}
              onChange={e => setAmount(e.target.value ? e.target.value.replace(/\./g, '') : '')}
            />
            <IconButton
              variant="contained"
              size="small"
              onClick={() => handleAdd(-1)}
            >
              <Remove/>
            </IconButton>
          </div>
        </React.Fragment>
      }
      actions={
        <React.Fragment>
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
        </React.Fragment>
      }
    />
  );
}

export default RestockModal;
