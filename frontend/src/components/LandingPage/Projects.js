import * as React from 'react';
import {getProjects} from '../../utils/requests';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PublicIcon from '@mui/icons-material/Public';
import Chip from '@mui/material/Chip';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';

function Projects(props) {
  const {addresses} = props;
  const projects = getProjects(addresses);
  return (
    <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
      {projects.map((project) => {
        return (
          <Grid item xs={6}>
            <Card sx={{maxWidth: 550}}>
              <CardMedia
                sx={{height: 240}}
                image={`https://senken-project-assets.s3.us-west-2.amazonaws.com/${project.tokenSymbol}.png`}
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {project.name.substring(0, 40)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description.substring(0, 285)}
                </Typography>
              </CardContent>
              <CardActions>
                <Chip icon={<PublicIcon/>} label={project.location} variant="outlined"/>
                <Chip icon={<ThumbsUpDownIcon/>} label={`Carbon Rating: ${project.bezeroRating}`} variant="outlined"/>
              </CardActions>
            </Card>
          </Grid>);
      })}
    </Grid>
  );
}

export default Projects;