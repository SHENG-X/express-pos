import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import {
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
  Tooltip,
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
import { fmtStaffNo } from '../../../../../utils';

const Staff = () => {
  const [open, setOpen] = useState(false);
  const { userState, getStaff } = useContext(Context);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [computedStaff, setComputedStaff] = useState([]);

  useEffect(() => {
    if (userState.staff === undefined) {
      getStaff();
    }
  }, []);

  useEffect(() => {
    setComputedStaff(computeStaff());
  }, [searchText, userState.staff]);

  const updateCurrentStaff = (staff) => {
    setCurrentStaff(staff);
    setOpen(true);
  }

  const computeStaff = () => {
    let staff = userState.staff;

    if (searchText !== '') {
      staff = staff.filter(stf => {
        let stfObj = {
          staffNo: fmtStaffNo(stf.staffNo),
          enable: stf.enable,
          role: stf.role,
          lname: stf.lname,
          fname: stf.fname,
          phone: stf.phone,
          email: stf.email,
        };
        const stfStr = Object.values(stfObj).join('');
        if (stfStr.toLowerCase().includes(searchText.toLowerCase())) {
          return stf;
        }
      })
    }

    return staff;
  }

  return (
    <React.Fragment>
      <CardBase
        title={ `Manage Staff` }
        className="staff"
      >
        <div className="row actions">
            {
              userState.role !== 'Employee' &&
              <Button
              color="primary"
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Add Staff
            </Button>
            }
            <div className="search">
              <Input
                placeholder={ 'Search for a staff' }
                onChange={e => setSearchText(e.target.value)}
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
                  <TableCell>Staff No.</TableCell>
                  <TableCell>Enable</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  {
                    userState.role !== 'Employee' &&
                    <TableCell>Actions</TableCell>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  computedStaff?.map(staff => <StaffRow staff={staff} handleUpdate={updateCurrentStaff} key={staff._id} />)
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
  const { userState, deleteStaff } = useContext(Context);
  const { addToast } = useToasts();

  return (
    <TableRow>
      <TableCell>
        <Typography variant="body2">
          { fmtStaffNo(staff.staffNo) }
        </Typography>
      </TableCell>
      <TableCell
        className="text-capitalized"
      >
        <Typography variant="body2">
          { staff.enable.toString() }
        </Typography>
      </TableCell>
      <TableCell
        className="text-capitalized"
      >
        <Typography variant="body2">
          { staff.role }
        </Typography>
      </TableCell>
      <TableCell
        className="text-capitalized"
      >
        <Typography variant="body2">
          { staff.fname.toLowerCase() }
        </Typography>
      </TableCell>
      <TableCell
        className="text-capitalized"
      >
        <Typography variant="body2">
          { staff.lname.toLowerCase() }
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          { staff.phone }
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">
          { staff.email }
        </Typography>
      </TableCell>
      {
        userState.role !== 'Employee' &&
        <TableCell>
          <Tooltip
            title="Edit"
            arrow
          >
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleUpdate(staff)}
              disabled={staff.role === 'Manager' && userState.role === 'Manager'}
            >
              <Edit/>
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Delete"
            arrow
          >
            <IconButton
              color="primary"
              size="small"
              onClick={() => deleteStaff(
                staff._id,
                () => {
                  addToast('Staff was deleted', { appearance: 'success' });
                },
                () => {
                  addToast('Unable to delete the staff', { appearance: 'error' });
                }
              )}
              disabled={staff.role === 'Manager' && userState.role === 'Manager'}
            >
              <Delete/>
            </IconButton>
          </Tooltip>
        </TableCell>
      }
    </TableRow>
  );
}

export default Staff;
