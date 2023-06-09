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
import { ethers } from "ethers";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Projects from './Projects';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Co2Icon from '@mui/icons-material/Co2';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

function FeaturedPost(props) {
  const { buyer } = props;
  console.log('buyer featured post', buyer);
  return (
    <Grid item xs={12} md={12}>
      <CardActionArea component="a" href="#">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {buyer.address}
            </Typography>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
              }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Co2Icon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Tones" secondary={ethers.utils.formatEther(buyer.data.tcoAmount)} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AttachMoneyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="USDC" secondary={ethers.utils.formatUnits(buyer.data.usdcAmount, 6)} />
              </ListItem>
            </List>
            <Accordion variant="standard" padding="none">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                padding="none"
                sx={{ "paddingLeft":0 }}
              >
                <Typography variant="standard" padding="none">Invested In</Typography>
              </AccordionSummary>
              <AccordionDetails padding="none">
                <Projects addresses = {buyer.data.token}/>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default FeaturedPost;