import React, {
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';

import CardBase from '../../cardbase/CardBase';
import { Context } from '../../../../../context/userContext';
import { fmtStaffNo } from '../../../../../utils';

const Profile = () => {
  const { userState, updateStaff } = useContext(Context);
  const [profile, setProfile] = useState(JSON.parse(JSON.stringify(userState)));
  const [newPassword, setNewPassword] = useState(false);
  const [allowUpdate, setAllowUpdate] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => {
    if (JSON.stringify(profile) === JSON.stringify(userState)) {
      setAllowUpdate(false);
    } else {
      setAllowUpdate(true);
    }
  }, [profile]);

  useEffect(() => {
    setProfile(JSON.parse(JSON.stringify(userState)));
  }, [userState]);

  const handleCancel = () => {
    setNewPassword(false);
    setProfile({ ...profile, password: null });
  }

  const handleConfirm = () =>{
    updateStaff(
      profile,
      () => {
        addToast('Profile updated', { appearance: 'success' });
        // close modal window on staff added
        handleCancel(false);
      },
      () => {
        addToast('Unable to update the profile', { appearance: 'error' });
      }
    );
  }

  return (
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
            { userState.role }
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
            { fmtStaffNo(userState.staffNo) }
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
          <TextField
            value={profile.fname}
            onChange={e => setProfile({...profile, fname: e.target.value})}
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
          <TextField
            value={profile.lname}
            onChange={e => setProfile({...profile, lname: e.target.value})}
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
          <TextField
            type="tel"
            value={profile.phone}
            onChange={e => setProfile({...profile, phone: Number(e.target.value)})}
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
            { profile.email }
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
            !newPassword ?
            <Button
              variant="contained"
              onClick={() => setNewPassword(true)}
            >
              New Password
            </Button>
            :
            <div className="form">
              <div className="inputs">
                <TextField
                  type="password"
                  placeholder={ `New password` }
                  onChange={e => setProfile({...profile, password: e.target.value})}
                />
                {/* <TextField
                  type="password"
                  placeholder={ `Confirm password` }
                  onChange={e => setProfile({...profile, newPassword: e.target.value})}
                /> */}
              </div>
              <div className="cancel">
                <Button
                  variant="contained"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          }
        </div>
      </div>
      {
        allowUpdate &&
        <div className="row actions">
          <Button
            onClick={() => setProfile(JSON.parse(JSON.stringify(userState)))}
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      }
    </CardBase>
  );
}

export default Profile;
