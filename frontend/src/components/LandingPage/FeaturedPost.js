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

function FeaturedPost(props) {
  const { buyer } = props;
  console.log('buyer featured post', buyer);
  return (
    <Grid item xs={12} md={12}>
      <CardActionArea component="a" href="#">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {buyer.address}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              <b>USDC: </b> {ethers.utils.formatUnits(buyer.data.usdcAmount, 6)}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              <b>CO₂ Tonne:</b> {ethers.utils.formatEther(buyer.data.tcoAmount)}
            </Typography>
            <Accordion variant="standard" padding="none">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                padding="none"
                sx={{ "paddingLeft":0 }}
              >
                <Typography variant="standard" padding="none">More</Typography>
              </AccordionSummary>
              <AccordionDetails padding="none">
              <List>
              {buyer.data.token.map((token) => { 
                console.log('token', token);
                return (<ListItem>
                  <ListItemText
                    primary={token}
                  />
                  </ListItem>);
              })}
            </List>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}

export default FeaturedPost;