import React, {
  useState,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Field, Form, FormSpy } from 'react-final-form';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import Typography from './modules/components/Typography';
import AppFooter from './modules/views/AppFooter';
import AppAppBar from './modules/views/AppAppBar';
import AppForm from './modules/views/AppForm';
import { email, required } from './modules/form/validation';
import RFTextField from './modules/form/RFTextField';
import FormButton from './modules/form/FormButton';
import FormFeedback from './modules/form/FormFeedback';
import withRoot from './modules/withRoot';
import { Context as StoreContext } from '../context/storeContext';
import { Context as UserContext } from '../context/userContext';

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
  },
  nameRow: {
    display: 'flex',
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  fname: {
    marginRight: '0.5rem',
  },
  lname: {
    marginLeft: '0.5rem',
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const { t } = useTranslation();
  const { signUp } = useContext(UserContext);
  const { loadStore } = useContext(StoreContext);
  const history = useHistory();
  const { addToast } = useToasts();

  const validate = (values) => {
    const errors = required(
      ['name', 'email', 'password'],
      values,
    );

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
    await signUp(
      {
        name: values.name,
        fname: values.fname,
        lname: values.lname,
        password: values.password,
        email: values.email,
        phone: values.phone,
      },
      async () => {
        // on success redirect to sale page
        await loadStore(
          () => {
            history.push('/sale');
          },
          () => {
            addToast('Failed to load store', { appearance: 'error' });
          },
        );
      },
      () => {
        // on fail show error message
        addToast(t('signUp.invalid'), { appearance: 'error' });
      },
    );
    setSent(false);
  };

  return (
    <>
      <AppAppBar />
      <AppForm>
        <>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            { t('signUp.heading') }
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/#/sign-in/" underline="always">
              { t('signUp.subtitle') }
            </Link>
          </Typography>
        </>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <form onSubmit={handleSubmit2} className={classes.form} noValidate>
              <Field
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label={t('signUp.business')}
                name="name"
                required
              />
              <div className={classes.nameRow}>
                <Field
                  autoFocus
                  component={RFTextField}
                  disabled={submitting || sent}
                  className={classes.fname}
                  fullWidth
                  label="First name"
                  name="fname"
                  required
                />
                <Field
                  autoFocus
                  component={RFTextField}
                  disabled={submitting || sent}
                  className={classes.lname}
                  fullWidth
                  label="Last name"
                  name="lname"
                  required
                />
              </div>
              <Field
                autoComplete="tel"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Phone Number"
                margin="normal"
                name="phone"
                required
              />
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label={t('common.email')}
                margin="normal"
                name="email"
                required
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label={t('common.password')}
                type="password"
                margin="normal"
              />
              {/* <FormSpy subscription={{ submitError: true }}>
                {
                  ({ submitError }) => submitError && (
                    <FormFeedback className={classes.feedback} error>
                      {submitError}
                    </FormFeedback>
                  )
                }
              </FormSpy> */}
              <FormButton
                className={classes.button}
                disabled={submitting || sent}
                color="secondary"
                fullWidth
              >
                {submitting || sent ? t('common.inProgress') : t('signUp.heading')}
              </FormButton>
            </form>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </>
  );
};

export default withRoot(SignUp);
