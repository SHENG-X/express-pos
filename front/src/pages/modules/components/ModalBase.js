import React from 'react';
import {
  Typography,
  Paper,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { classNames } from '../../../utils';

const ModalBase = ({
  content,
  actions,
  title,
  className,
}) => (
  <div className={classNames(['carpet', className])}>
    <Paper elevation={3}>
      <div className="heading">
        <Typography variant="h5">
          { title }
        </Typography>
      </div>
      <div className="body">
        <div className="content">
          { content }
        </div>
        <div className="actions">
          { actions }
        </div>
      </div>
    </Paper>
  </div>
);

ModalBase.propTypes = {
  content: PropTypes.node.isRequired,
  actions: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ModalBase.defaultProps = {
  className: '',
};

export default ModalBase;
