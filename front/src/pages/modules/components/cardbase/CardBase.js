import React from 'react';
import {
  Paper, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import './index.scss';
import { classNames } from '../../../../utils';

const CardBase = ({ title, children, className }) => (
  <Paper
    elevation={3}
    className={classNames(['card-base', className])}
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

CardBase.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardBase.defaultProps = {
  className: '',
};

export default CardBase;
