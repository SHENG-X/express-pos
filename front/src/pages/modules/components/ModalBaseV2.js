import React from 'react';
import {
  Typography,
  Paper
} from '@material-ui/core'
import { classNames } from '../../../utils';

const ModalBaseV2 = ({ children, title, className = '' }) => {
  return (
    <div className={classNames(['carpet', className])}>
      <Paper elevation={3}>
        <div className="heading">
          <Typography variant="h5">
            { title }
          </Typography>
        </div>
        <div className="body">
          { children }
        </div>
      </Paper>
    </div>
  );
}

export default ModalBaseV2;
