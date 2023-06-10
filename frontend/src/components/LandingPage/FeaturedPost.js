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

function FeaturedPost(props) {
  const {buyer} = props;

  const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const place = {
    maxWidth: '80px',
    height: '75px',
  }

  const height = {
    height: '75px',
    marginTop: '0px'
  }

  return (
    <Grid item xs={12} md={12}>
      <CardActionArea component="a" href="#">
        <Card sx={{display: 'flex'}}>
          <CardContent sx={{flex: 1}}>
            <List
              sx={{
                bgcolor: 'background.paper',
              }}
              style={flexContainer}
              component={Stack}
              spacing={2}
            >
              <ListItem style={place}>
                <Chip label={buyer.index + 1} variant="outlined"/>
              </ListItem>
              <ListItem style={height}>
                <Typography variant="h6" gutterBottom>
                  {buyer.address.key}
                </Typography>
              </ListItem>
              <ListItem style={height}>
                <ListItemAvatar>
                  <Avatar>
                    <Co2Icon/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Tones" secondary={ethers.utils.formatEther(buyer.data.tcoAmount)}/>
              </ListItem>
              <ListItem style={height}>
                <ListItemAvatar>
                  <Avatar>
                    <AttachMoneyIcon/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="USDC" secondary={ethers.utils.formatUnits(buyer.data.usdcAmount, 6)}/>
              </ListItem>
            </List>
            <Accordion variant="standard" padding="none">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                padding="none"
                sx={{"paddingLeft": 0}}
              >
                <Typography variant="standard" padding="none">Invested In</Typography>
              </AccordionSummary>
              <AccordionDetails padding="none">
                <Projects addresses={buyer.data.token}/>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default FeaturedPost;