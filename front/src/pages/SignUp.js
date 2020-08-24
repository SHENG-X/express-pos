import React, {
  useState,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Field, Form, FormSpy } from 'react-final-form';
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
import { UserContext } from '../context/userContext';

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

const SignUp = () => {
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const { t } = useTranslation();
  const { signUp } = useContext(UserContext);
  const history = useHistory();

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
    setInvalid(false);
    setSent(true);
    await signUp({ name: values.name, password: values.password, email: values.email }, (response) => {
      if (response.status === 226) {
        setInvalid(true);
      } else if (response.status === 201) {
        history.push('/');
      }
    });
    setSent(false);
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            { t('signUp.heading') }
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/sign-in/" underline="always">
              { t('signUp.subtitle') }
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
                    { t('signUp.invalid') }
                  </Typography>
                </React.Fragment>
                :
                null
              }
              <Field
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label={ t('signUp.business') }
                name="name"
                required
              />
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label={ t('common.email') }
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
    </React.Fragment>
  );
}

export default withRoot(SignUp);
