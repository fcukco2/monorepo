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
    marginTop: '0px',
  }

  return (
    <Grid item xs={12} md={12}>
      <CardActionArea component="a" href="#">
        <Card sx={{display: 'flex'}}>
          <CardContent sx={{flex: 1}} style={{padding: '0px'}}>
            <Accordion variant="standard" padding="none">
              <List
                sx={{
                  bgcolor: 'background.paper',
                }}
                style={flexContainer}
                component={Stack}
                spacing={1}
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
                  <ListItemText primary={ethers.utils.formatEther(buyer.data.tcoAmount)}/>
                </ListItem>
                <ListItem style={height}>
                  <ListItemText primary={ethers.utils.formatUnits(buyer.data.usdcAmount, 6)}/>
                </ListItem>
                <ListItem style={{height: '75px', width: '50px', marginTop: '0px'}}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    padding="none"
                    sx={{"paddingLeft": 0}}
                  >
                  </AccordionSummary>
                </ListItem>
              </List>
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