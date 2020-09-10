import React from 'react';
import {
  Paper, Typography,
} from '@material-ui/core';
import './index.scss';
import { classNames } from '../../../../utils';

const CardBase = ({ title, children, className }) => {
  return (
    <Paper
      elevation={3}
      className={["card-base", className]}
    >
      <div className="header">
        <Typography variant="subtitle1">
          { title }
        </Typography>
      </div>
      <div className="content">
        { children }
      </div>
    </Paper>
  );
}

export default CardBase;
