import React from 'react';
import {
  Typography,
  Paper,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { classNames } from '../../../utils';

const ModalBaseV2 = ({ children, title, className }) => (
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

ModalBaseV2.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ModalBaseV2.defaultProps = {
  className: '',
};

export default ModalBaseV2;
