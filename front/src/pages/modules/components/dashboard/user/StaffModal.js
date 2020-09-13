import React, {
  useState,
  useContext,
} from 'react';
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import {
  Add,
  Remove,
  ArrowForward,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';

import ModalBase from '../../ModalBase';
import { Context } from '../../../../../context/storeContext';

const StaffModal = ({ handleOpen }) => {
  const [staff, setStaff] = useState({
    role: 'Employee', // role can only be Employee or Manager
    email: '',
    password: '',
    fname: '',
    lname: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleConfirm = () => {
    console.log(staff);
  }

  return (
    <ModalBase
      title="Add a staff"
      className="staff-modal"
      content={
        <React.Fragment>
          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                { 'Role' }
              </Typography>
            </div>
            <div className="input">
              <FormControl variant="outlined">
                <InputLabel>{ 'Role' }</InputLabel>
                <Select
                  value={ staff.role }
                  onChange={e => setStaff({...staff, role: e.target.value})}
                  label={'Role'}
                >
                  <MenuItem value={'Manager'}>
                    Manager
                  </MenuItem>
                  <MenuItem value={'Employee'}>
                    Employee
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="row">
            <div className="label">
              <Typography variant="subtitle2">
                First Name
              </Typography>
            </div>
            <div className="input">
              <TextField
                placeholder="First name"
                value={staff.fname}
                onChange={e => setStaff({...staff, fname: e.target.value})}
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
              <TextField
                placeholder="Last name"
                value={staff.lname}
                onChange={e => setStaff({...staff, lname: e.target.value})}
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
              <TextField
                type="tel"
                placeholder="Phone number"
                value={staff.phone}
                onChange={e => setStaff({...staff, phone: e.target.value})}
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
              <TextField
                type="email"
                placeholder="Email"
                value={staff.email}
                onChange={e => setStaff({...staff, email: e.target.value})}
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
              <TextField
                type="password"
                placeholder="Password"
                value={staff.password}
                onChange={e => setStaff({...staff, password: e.target.value})}
              />
            </div>
          </div>

        </React.Fragment>
      }
      actions={
        <React.Fragment>
          <Button
            variant="contained"
            onClick={() => handleOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </React.Fragment>
      }
    />
  )
}

export default StaffModal;
