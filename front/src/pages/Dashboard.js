import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from './modules/components/Typography';
import AppAppBar from './modules/views/AppAppBar';
import withRoot from './modules/withRoot';

function Privacy() {
  return (
    <React.Fragment>
      <AppAppBar />
      <Container>
        <Box mt={7} mb={12}>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Dashboard
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default withRoot(Privacy);
