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
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';

import { Context } from '../../../../../context/storeContext';
import CardBase from '../../cardbase/CardBase';
import StaffModal from './StaffModal';

const Staff = () => {
  const [open, setOpen] = useState(false);

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
        <Table
          className="row"
        >
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

          </TableBody>
        </Table>
      </CardBase>
      { open && <StaffModal handleOpen={val => setOpen(val)}/> }
    </React.Fragment>
  );
}

export default Staff;
