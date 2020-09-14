import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Switch,
  TextField,
  Typography,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import {
  Search,
  Edit,
  Delete,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';

import { Context } from '../../../../../context/userContext';
import CardBase from '../../cardbase/CardBase';
import StaffModal from './StaffModal';

const Staff = () => {
  const [open, setOpen] = useState(false);
  const { userState, getStaff } = useContext(Context);
  const [currentStaff, setCurrentStaff] = useState(null);
  useEffect(() => {
    if (userState.staff === undefined) {
      getStaff();
    }
  }, []);

  const updateCurrentStaff = (staff) => {
    setCurrentStaff(staff);
    setOpen(true);
  }

  return (
    <React.Fragment>
      <CardBase
        title={ `Manage Staff` }
        className="staff"
      >
        <div className="row actions">
            <Button
              color="primary"
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Add Staff
            </Button>
            <div className="search">
              <Input
                placeholder={ 'Search for a staff' }
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </div>
          </div>
          <div className="table-container">
            <Table stickyHeader >
              <TableHead>
                <TableRow>
                  <TableCell>Enable</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  userState?.staff?.map(staff => <StaffRow staff={staff} handleUpdate={updateCurrentStaff} key={staff._id} />)
                }
              </TableBody>
            </Table>
          </div>
      </CardBase>
      { open && <StaffModal handleOpen={val => setOpen(val)} currentStaff={currentStaff} resetCurrentStaff={() => setCurrentStaff(null)}/> }
    </React.Fragment>
  );
}

const StaffRow = ({ staff, handleUpdate }) => {
  const { deleteStaff } = useContext(Context);
  const { addToast } = useToasts();

  return (
    <TableRow>
      <TableCell>
        { staff.enable.toString() }
      </TableCell>
      <TableCell>
        { staff.role }
      </TableCell>
      <TableCell>
        { staff.fname }
      </TableCell>
      <TableCell>
        { staff.lname }
      </TableCell>
      <TableCell>
        { staff.phone }
      </TableCell>
      <TableCell>
        { staff.email }
      </TableCell>
      <TableCell>
        <IconButton
          onClick={() => handleUpdate(staff)}
        >
          <Edit/>
        </IconButton>
        <IconButton
          onClick={() => deleteStaff(
            staff._id,
            () => {
              addToast('Staff was deleted', { appearance: 'success' });
            },
            () => {
              addToast('Unable to delete the staff', { appearance: 'error' });
            }
          )}
        >
          <Delete/>
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default Staff;
