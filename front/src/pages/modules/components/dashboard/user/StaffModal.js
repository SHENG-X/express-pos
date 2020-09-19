import React, {
  useState,
  useContext,
} from 'react';
import {
  Typography,
  Button,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import {Formik, Form, Field} from 'formik';
import {
  TextField,
  Switch,
} from 'formik-material-ui';

import ModalBaseV2 from '../../ModalBaseV2';
import { Context } from '../../../../../context/userContext';
import { 
  validateName,
  validatePhone,
  validateEmail,
  validatePassword,
 } from '../../../form/validation';
 import LowerCaseTextField from '../../../formik/LowerCaseTextField';
 import PhoneNumberTextField from '../../../formik/PhoneNumberTextField';


const StaffModal = ({ handleOpen, currentStaff, resetCurrentStaff }) => {
  let defaultStaff = {
    role: 'Employee', // role can only be Employee or Manager
    email: '',
    password: '',
    fname: '',
    lname: '',
    phone: '',
    email: '',
    password: '',
  };

  if (currentStaff) {
    // current staff was set, staff modal should be in update mode
    defaultStaff = { ...currentStaff };
  }

  const [ staff ] = useState({ ...defaultStaff });
  const { userState, addStaff, updateStaff } = useContext(Context);
  const { addToast } = useToasts();

  const handleConfirm = (values, completeSubmit) => {
    values = { ...values, phone: Number(`${values.phone}`.match(/\d/g)?.join(''))}
    if (currentStaff) {
      if (JSON.stringify(values) === JSON.stringify(currentStaff)) {
        completeSubmit();
        resetCurrentStaff();
        handleOpen(false);
        return;
      }
      updateStaff(
        values,
        () => {
          completeSubmit();
          addToast('Staff updated', { appearance: 'success' });
          // close modal window on staff added
          resetCurrentStaff();
          handleOpen(false);
        },
        () => {
          completeSubmit();
          addToast('Unable to update the staff', { appearance: 'error' });
        }
      );
    } else {
      addStaff(
        values,
        () => {
          completeSubmit();
          addToast('New staff was added', { appearance: 'success' });
          // close modal window on staff added
          handleOpen(false);
        },
        () => {
          completeSubmit();
          addToast('Unable to add the staff, please try again later', { appearance: 'error' });
        }
      );
    }
  }

  return (
    <ModalBaseV2
      title="Add a staff"
      className="staff-modal"
    >
      <Formik
        initialValues={staff}
        validate={(values) => {
          const errors =  {};
          if (currentStaff) {
            // validate for update
            if (values.fname !== currentStaff.fname) {
              if (validateName(values.fname)) {
                errors.fname = validateName(values.fname);
              }
            }
            if (values.lname !== currentStaff.lname) {
              if (validateName(values.lname)) {
                errors.lname = validateName(values.lname);
              }
            }
            if (values.email !== currentStaff.email) {
              if (validateEmail(values.email)) {
                errors.email = validateEmail(values.email);
              }
            }
            if (Number(`${values.phone}`?.match(/\d/g)?.join('')) !== Number(currentStaff.phone)) {
              if (validatePhone(values.phone)) {
                errors.phone = validatePhone(values.phone);
              }
            }
            if (values.password !== currentStaff.password) {
              if (validatePassword(values.password)) {
                errors.password = validatePassword(values.password);
              }
            }
            
          } else {
            if (validateName(values.fname)) {
              errors.fname = validateName(values.fname);
            }
            if (validateName(values.lname)) {
              errors.lname = validateName(values.lname);
            }
            if (validateEmail(values.email)) {
              errors.email = validateEmail(values.email);
            }
            if (validatePhone(values.phone)) {
              errors.phone = validatePhone(values.phone);
            }
            if (validatePassword(values.password)) {
              errors.password = validatePassword(values.password);
            }
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleConfirm(values, () => setSubmitting(false));
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <React.Fragment>

              <div className="content">
                <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      { 'Role' }
                    </Typography>
                  </div>
                  <div className="input">
                    <Field
                      component={TextField}
                      type="text"
                      name="role"
                      select
                      variant="outlined"
                    >
                      {
                        userState.role === 'Owner' &&
                        <MenuItem value={'Manager'}>
                          Manager
                        </MenuItem>
                      }
                      <MenuItem value={'Employee'}>
                        Employee
                      </MenuItem>
                    </Field>
                  </div>
                </div>
                
                {
                  currentStaff &&
                  <div className="row">
                    <div className="label">
                      <Typography variant="subtitle2">
                        Enable
                      </Typography>
                    </div>
                    <div className="input">
                      <Field
                        component={Switch}
                        type="checkbox"
                        name="enable"
                        color="primary"
                      />
                    </div>
                  </div>
                } 

                <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      First Name
                    </Typography>
                  </div>
                  <div className="input">
                    <Field
                      component={TextField}
                      name="fname"
                      placeholder="First name"
                      autoComplete='new-fname'
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      Last Name
                    </Typography>
                  </div>
                  <div className="input">
                    <Field
                      component={TextField}
                      name="lname"
                      placeholder="Last name"
                      autoComplete='new-lname'
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      Phone Number
                    </Typography>
                  </div>
                  <div className="input">
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
                  <div className="input">
                    <Field
                      component={LowerCaseTextField}
                      type="email"
                      name="email"
                      placeholder="Email"
                      autoComplete='new-email'
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="label">
                    <Typography variant="subtitle2">
                      Password
                    </Typography>
                  </div>
                  <div className="input">
                    <Field
                      component={TextField}
                      type="password"
                      name="password"
                      placeholder="Password"
                      autoComplete='new-password'
                    />
                  </div>
                </div>
              </div>
              {
                  isSubmitting &&
                  <div className="flex justify-center">
                    <CircularProgress />
                  </div>
              }
              <div className="actions">
                <Button
                  variant="contained"
                  onClick={() => {
                    if (currentStaff) {
                      resetCurrentStaff();
                    }
                    handleOpen(false)
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={submitForm}
                  disabled={isSubmitting}
                >
                  Confirm
                </Button>
            </div>
            </React.Fragment>
          </Form>
        )}
      </Formik>
    </ModalBaseV2>
  )
}

export default StaffModal;
