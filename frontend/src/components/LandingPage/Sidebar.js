import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ButtonBase from '@mui/material/ButtonBase';
import {styled} from '@mui/material/styles';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function Sidebar(props) {
  const {social} = props;

  return (
    <>
      <Paper
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ButtonBase>
              <Img alt="complex"
                   src="https://images.unsplash.com/photo-1497384401032-2182d2687715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2ODYzOTI4ODQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1024"/>
            </ButtonBase>
          </Grid>
          <Grid item xs={6} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  Regenerative Finance
                </Typography>
                <Typography variant="subtitle1" gutterBottom style={{color: '#667085'}}>
                  We are all aware of the importance of reducing emissions, but it is insufficient on its own. It is
                  crucial to offset unavoidable emissions by utilizing carbon credits as part of a comprehensive
                  net-zero strategy. However, the existing system has its flaws: it is challenging to access, the
                  industry is saturated with intermediaries who charge exorbitant fees, there is a lack of independent
                  ratings to evaluate the quality of projects, and most transactions occur behind closed doors, impeding
                  price signals.
                </Typography>
                <Typography variant="subtitle1" gutterBottom style={{color: '#667085'}}>
                  That is why we are utilizing blockchain technology to make the carbon market accessible to everyone.
                  We aim to simplify the complex technical aspects of this emerging movement and present it to you
                  through an intuitive and user-friendly interface.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Grid item xs={12} md={12}>
        {social.map((network) => (
          <Link
            display="block"
            variant="body1"
            href={network.link}
            key={network.name}
            sx={{mb: 0.5}}
          >
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" style={{marginTop: '20px'}}>
              <network.icon/>
              <span>{network.name}</span>
            </Stack>
          </Link>
        ))}
      </Grid>
    </>
  );
}

Sidebar.propTypes = {
  description: PropTypes.string.isRequired,
  social: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Sidebar;