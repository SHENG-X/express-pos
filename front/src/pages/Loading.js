import React from 'react';
import {
  Typography
} from '@material-ui/core';

const Loading = () => {
  return (
    <div className="loading">
      <div className="main">
        <div className="inner">
          <Typography variant="h2">
            LOADING.....
          </Typography>
          <div className="bar">
            <div className="main-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
