import React from 'react';
import {
  TextField
} from '@material-ui/core';

const MdcIntTextField = (props) => {
  return (
    <TextField
      { ...props }
      type="number"
      step="1" 
      onKeyDown={(e) => {
        if (e.keyCode === 190) {
          e.preventDefault();
        }
      }}
    />
  );
}

export default MdcIntTextField;
