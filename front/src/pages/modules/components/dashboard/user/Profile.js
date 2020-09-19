import React, {
  useContext,
  useState,
} from 'react';
import {
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import {Formik, Form, Field} from 'formik';

import CardBase from '../../cardbase/CardBase';
import { Context } from '../../../../../context/userContext';
import { fmtStaffNo } from '../../../../../utils';
import { UpdateUserSchema } from '../../../formik/validationSchema';
import {
  TextField,
} from 'formik-material-ui';
import PhoneNumberTextField from '../../../formik/PhoneNumberTextField';

const Profile = () => {
  const { userState, updateStaff } = useContext(Context);
  const [allowNewPassword, setAllowNewPassword] = useState(false);
  const { addToast } = useToasts();

  const handleConfirm = (profile, resetForm) => {

    updateStaff(
      profile,
      () => {
        setAllowNewPassword(false);
        resetForm(userState);
        addToast('Profile updated', { appearance: 'success' });
      },
      () => {
        addToast('Unable to update the profile', { appearance: 'error' });
      }
    );
  }

  return (
    <Formik
      initialValues={userState}
      validationSchema={UpdateUserSchema}
      onSubmit={(values, { resetForm }) => {
        handleConfirm(values, resetForm);
      }}
    >
      {({ submitForm, isSubmitting, values, setFieldValue }) => (
        <Form>
          <CardBase
            title={ `Profile` }
            className="profile"
          >
            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  Role
                </Typography>
              </div>
              <div className="value">
                <Typography variant="body1">
                  { values.role }
                </Typography>
              </div>
            </div>

            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  Staff No.
                </Typography>
              </div>
              <div className="value">
                <Typography variant="body1">
                  { fmtStaffNo(values.staffNo) }
                </Typography>
              </div>
            </div>

            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  First Name
                </Typography>
              </div>
              <div className="value">
                <Field
                  component={TextField}
                  name="fname"
                  placeholder="First name"
                />
              </div>
            </div>

            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  Last Name
                </Typography>
              </div>
              <div className="value">
              <Field
                  component={TextField}
                  name="lname"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="row">
              <div className="label">
                  <Typography variant="subtitle2">
                    Phone Number
                  </Typography>
              </div>
              <div className="value">
                <Field
                  component={PhoneNumberTextField}
                  type="tel"
                  name="phone"
                  autoComplete='new-phone'
                />
              </div>
            </div>

            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  Email
                </Typography>
              </div>
              <div className="value">
                <Typography variant="body1">
                  { values.email }
                </Typography>
              </div>
            </div>

            <div className="row">
              <div className="label">
                <Typography variant="subtitle2">
                  Password
                </Typography>
              </div>
              <div className="value password">
                {
                  !allowNewPassword ?
                  <Button
                    variant="contained"
                    onClick={() => setAllowNewPassword(true)}
                  >
                    New Password
                  </Button>
                  :
                  <div className="form">
                    <div className="inputs">
                      <Field
                        component={TextField}
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete='new-password'
                      />
                    </div>
                    <div className="cancel">
                      <Button
                        variant="contained"
                        onClick={() => {
                          setFieldValue('password', null);
                          setAllowNewPassword(false)
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                }
              </div>
            </div>
            {
              isSubmitting &&
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            }
            {
              JSON.stringify(values) !== JSON.stringify(userState) &&
              <div className="row actions">
                <Button
                  variant="contained"
                  onClick={() => {
                    setFieldValue('fname', userState.fname);
                    setFieldValue('lname', userState.lname);
                    setFieldValue('phone', userState.phone);
                    setFieldValue('password', null);
                    setAllowNewPassword(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                  disabled={isSubmitting}
                >
                  Confirm
                </Button>
              </div>
            }
          </CardBase>
        </Form>
      )}
    </Formik>
  );
}

export default Profile;
