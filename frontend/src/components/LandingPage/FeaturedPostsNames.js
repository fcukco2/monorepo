import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {ethers} from "ethers";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Projects from './Projects';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Co2Icon from '@mui/icons-material/Co2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

function FeaturedPostsNames() {

  const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const place = {
    maxWidth: '100px',
    height: '75px',
    paddingLeft: '16px'
  }

  const height = {
    height: '75px',
    marginTop: '0px',
  }

  return (
    <Grid item xs={12} md={12}>
      <List
        sx={{
          bgcolor: 'background.paper',
        }}
        style={flexContainer}
        component={Stack}
        spacing={1}
      >
        <ListItem style={place}>
          <Chip label='#' variant="outlined"/>
        </ListItem>
        <ListItem style={{...height, minWidth: '40%'}}>
          <Typography variant="h6" gutterBottom>
            Adress
          </Typography>
        </ListItem>
        <ListItem style={{height, maxWidth: '23%'}}>
          <ListItemAvatar>
            <Avatar>
              <Co2Icon/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Tones"/>
        </ListItem>
        <ListItem style={height}>
          <ListItemAvatar>
            <Avatar>
              <AttachMoneyIcon/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="USDC"/>
        </ListItem>
      </List>
      <Divider/>
    </Grid>
  );
}

export default FeaturedPostsNames;