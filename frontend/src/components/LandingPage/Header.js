import * as React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

function Header(props) {
  const { title } = props;

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        { /* <Button size="small">Subscribe</Button> */ }
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
        { /*
        <IconButton>
          <SearchIcon />
        </IconButton>
        */ }
        <Button variant="outlined" size="small">
          Connect Wallet
        </Button>
      </Toolbar>
    </React.Fragment>
  );
}

export default Header;