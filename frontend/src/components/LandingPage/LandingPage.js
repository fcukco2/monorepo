import * as React from 'react';
import {useState, useEffect} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Sidebar from './Sidebar';
import Footer from './Footer';
import {getLeaders} from '../../utils/requests';
import FeaturedPostsNames from './FeaturedPostsNames';
import Typography from '@mui/material/Typography';

const mainFeaturedPost = {
  title: 'CO₂',
  description:
    "CO₂ Terminator is your ultimate blockchain beast built to annihilate carbon emissions. We're harnessing the power of smart contracts to automate the offsetting game like never before. Forget the manual labor, we're about to go auto and all-in on saving the planet.",
  //image: 'https://source.unsplash.com/random?wallpapers',
  image: 'https://images.unsplash.com/photo-1508138221679-760a23a2285b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d2FsbHBhcGVyc3x8fHx8fDE2ODYzMDIwNzM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const sidebar = {
  social: [
    {name: 'GitHub', icon: GitHubIcon, link: 'https://github.com/fcukco2/monorepo'},
  ],
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function LandingPage() {
  const [buyers, setBuyers] = useState([]);
  useEffect(() => {
    let mounted = true;
    getLeaders()
      .then(buyers => {
        if (mounted) {
          setBuyers(buyers)
        }
      })
    return () => mounted = false;
  }, [])
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline/>
      <Container maxWidth="lg">
        <Header title="CO₂"/>
        <main>
          <MainFeaturedPost post={mainFeaturedPost}/>
          <Typography variant="h4" gutterBottom style={{paddingLeft: "16px"}}>
            Leaderboard
          </Typography>
          <Grid container spacing={1}>
            <FeaturedPostsNames/>
            {buyers.map((buyer, index) => (
              <FeaturedPost key={index} buyer={{address: buyer, data: buyer, index: index}}/>
            ))}
          </Grid>
          <Grid container spacing={5} sx={{mt: 3, pl: 5}}>
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      <Footer
        title="Fcuk CO₂"
        description="An easy way to make useful!"
      />
    </ThemeProvider>
  );
}