import React, {
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  withStyles,
  Link as MDCLink,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import AppBar from '../components/AppBar';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import { Context as UserContext } from '../../../context/userContext';
import { Context as StoreContext } from '../../../context/storeContext';
import { classNames } from '../../../utils';

const styles = (theme) => ({
  title: {
    fontSize: 24,
    display: 'flex',
    alignItems: 'center',
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    display: 'flex',
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

const AppAppBar = (props) => {
  const { classes, beforeRouteChange } = props;
  const { t } = useTranslation();
  const { userState, signOut } = useContext(UserContext);
  const { storeState } = useContext(StoreContext);
  const history = useHistory();

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left}>
            <MDCLink
              variant="h6"
              underline="none"
              color="inherit"
              className={classNames([classes.title, 'app-bar-action'])}
              onClick={() => {
                if (beforeRouteChange) {
                  beforeRouteChange(() => history.push('/'));
                } else {
                  history.push('/');
                }
              }}
            >
              <span>
                Express POS
              </span>
              {
                userState.authenticated && (
                  <>
                    <span className="dash-separator">
                      -
                    </span>
                    <span>
                      { storeState.name }
                    </span>
                  </>
                )
              }
            </MDCLink>
          </div>
          <div className={classes.right}>
            {
              userState.authenticated === true
                ? (
                  <>
                    {
                      history.location.pathname !== '/dashboard' && (
                        <MDCLink
                          variant="h6"
                          underline="none"
                          className={classNames([clsx(classes.rightLink), 'app-bar-action'])}
                          onClick={() => {
                            if (props.beforeRouteChange) {
                              props.beforeRouteChange(() => history.push('/dashboard'));
                            } else {
                              history.push('/dashboard');
                            }
                          }}
                        >
                          Dashboard
                        </MDCLink>
                      )
                    }
                    {
                      history.location.pathname !== '/sale' && (
                        <MDCLink
                          variant="h6"
                          underline="none"
                          className={classNames([clsx(classes.rightLink), 'app-bar-action'])}
                          onClick={() => {
                            if (props.beforeRouteChange) {
                              props.beforeRouteChange(() => history.push('/sale'));
                            } else {
                              history.push('/sale');
                            }
                          }}
                        >
                          Sale
                        </MDCLink>
                      )
                    }
                    <MDCLink
                      variant="h6"
                      underline="none"
                      className={classNames([clsx(classes.rightLink), 'app-bar-action'])}
                      onClick={() => {
                        if (props.beforeRouteChange) {
                          props.beforeRouteChange(() => signOut(() => history.push('/')));
                        } else {
                          signOut(() => history.push('/'));
                        }
                      }}
                    >
                      SIGN OUT
                    </MDCLink>
                  </>
                ) : (
                  <>
                    <MDCLink
                      color="inherit"
                      variant="h6"
                      underline="none"
                      className={classNames([clsx(classes.rightLink), 'app-bar-action'])}
                      onClick={() => history.push('/sign-in')}
                    >
                      { t('signIn.heading') }
                    </MDCLink>
                    <MDCLink
                      variant="h6"
                      underline="none"
                      className={classNames([clsx(classes.rightLink, classes.linkSecondary), 'app-bar-action'])}
                      onClick={() => history.push('/sign-up')}
                    >
                      { t('signUp.heading') }
                    </MDCLink>
                  </>
                )
              }
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
};

AppAppBar.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.objectOf(PropTypes.object()).isRequired,
  beforeRouteChange: PropTypes.func,
};

AppAppBar.defaultProps = {
  // set default props
  beforeRouteChange: () => {},
};

export default withStyles(styles)(AppAppBar);
