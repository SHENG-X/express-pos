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

import CardBase from '../../cardbase/CardBase';
import { Context } from '../../../../../context/userContext';

const Profile = () => {
  const { userState } = useContext(Context);
  const [profile, setProfile] = useState(JSON.parse(JSON.stringify(userState)));
  const [newPassword, setNewPassword] = useState(false);
  const [allowUpdate, setAllowUpdate] = useState(false);

  useEffect(() => {
    if (JSON.stringify(profile) === JSON.stringify(userState)) {
      setAllowUpdate(false);
    } else {
      setAllowUpdate(true);
    }
  }, [profile]);

  const handleCancel = () => {
    setNewPassword(false);
    const newProfile = { ...profile };
    // remove new password property
    delete newProfile.newPassword;
    setProfile({ ...newProfile, password: null });
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
            { userState.staffNo.toString().padStart(5, '0') }
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
            onChange={e => setProfile({...profile, phone: e.target.value})}
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
                <TextField
                  type="password"
                  placeholder={ `Confirm password` }
                  onChange={e => setProfile({...profile, newPassword: e.target.value})}
                />
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
          >
            Confirm
          </Button>
        </div>
      }
    </CardBase>
  );
}

export default Profile;
