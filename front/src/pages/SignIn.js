import React, {
  useState,
  useContext,
} from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { useHistory } from "react-router-dom";

import Typography from './modules/components/Typography';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import { email, required } from './modules/form/validation';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';
import { Context } from '../context/storeContext';

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(6),
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  feedback: {
    marginTop: theme.spacing(2),
  },
  error: {
    color: '#f44336',
  }
}));

const SignIn = () => {
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();

  const { signIn } = useContext(Context);

  const validate = (values) => {

    const errors = required(['email', 'password'], values, t('common.required'));

    if (!errors.email) {
      const emailError = email(values.email, t('common.invalidEmail'));
      if (emailError) {
        errors.email = email(values.email, t('common.invalidEmail'));
      }
    }

    return errors;
  };

  const handleSubmit = async (values) => {
    setSent(true);
    setInvalid(false);
    await signIn(
      { email: values.email, password: values.password },
      () => {
        // on success redirect to sale page
        history.push('/sale')
      }, 
      () => {
        // on fail set invalid to true
        setInvalid(true)
      }
    );
    setSent(false);
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            { t('signIn.heading') }
          </Typography>
          <Typography variant="body2" align="center">
            { t('signIn.subtitle') }
            <Link
              href="/#/sign-up/"
              align="center"
              underline="always"
            >
              { t('signIn.subtitleAction') }
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <form onSubmit={handleSubmit2} className={classes.form} noValidate>
              {
                invalid ?
                <React.Fragment>
                  <Typography variant="body2" align="center" className={classes.error} >
                    { t('signIn.invalid') }
                  </Typography>
                </React.Fragment>
                :
                null
              }
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label={ t('common.email') }
                margin="normal"
                name="email"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label={ t('common.password') }
                type="password"
                margin="normal"
              />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback className={classes.feedback} error>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                className={classes.button}
                disabled={submitting || sent}
                size="large"
                color="secondary"
                fullWidth
              >
                {submitting || sent ? t('common.inProgress') : t('signIn.heading')}
              </FormButton>
            </form>
          )}
        </Form>
        <Typography align="center">
          <Link
            underline="always"
            href="/forgot-password/"
          >
            { t('signIn.forgotPassword') }
          </Link>
        </Typography>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
