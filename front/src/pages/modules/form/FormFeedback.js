import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Typography from '../components/Typography';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  error: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  success: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
});

const FormFeedback = ({
  classes,
  error,
  success,
  className,
  children,
}) => (
  <div
    className={clsx(
      classes.root,
      {
        [classes.error]: !!error,
        [classes.success]: !!success,
      },
      className,
    )}
  >
    <Typography color="inherit">{children}</Typography>
  </div>
);

FormFeedback.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.instanceOf(PropTypes.object).isRequired,
  className: PropTypes.string,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

FormFeedback.defaultProps = {
  children: null,
  className: '',
  error: false,
  success: false,
};

export default withStyles(styles)(FormFeedback);
