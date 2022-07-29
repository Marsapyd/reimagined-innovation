/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */
import { useState } from 'react';
import {
  Grid,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from 'semantic-ui-react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CarouselPage from '../components/Carousel';
import carouselExciteImageThree from '../assets/images/space-excite-three.png';
import CountdownTimer from '../components/CountdownTimer';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const DesktopContainer = ({ children }) => {
  const [, setFixed] = useState(false);

  const toggleFixedMenu = () => setFixed(prev => !prev);
  return (
    <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility
        once={false}
        onBottomPassed={toggleFixedMenu}
        onBottomPassedReverse={toggleFixedMenu}
      />
      {children}
    </Responsive>
  );
};
DesktopContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const MobileContainer = ({ children }) => (
  <Responsive
    as={Sidebar.Pushable}
    getWidth={getWidth}
    maxWidth={Responsive.onlyMobile.maxWidth}
  >
    {children}
  </Responsive>
);
MobileContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);
ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const HomepageLayout = () => {
  const token = useSelector(state => state.auth.token);

  return (
    <ResponsiveContainer>
      <Segment vertical>
        <CarouselPage />
      </Segment>
      <Segment
        style={{ padding: '2em 0em', backgroundColor: 'black' }}
        vertical
      >
        <Grid container stackable verticalAlign="middle">
          <div className="m-8 m-auto flex w-full flex-1 text-center">
            <Typography variant="h2" color="white">
              Does it surprise you that the earth is round? Come Explore a good
              time in space to be convinced
            </Typography>
          </div>
          <div className="bg-black">
            <img src={carouselExciteImageThree} alt="reinnovation" />
          </div>
        </Grid>
      </Segment>
      <Segment
        style={{ padding: '2em 0em', backgroundColor: 'black' }}
        vertical
      >
        <Grid container stackable verticalAlign="middle">
          <CountdownTimer countdownTimestampMs={1660683442000} />
        </Grid>
      </Segment>
      <Segment
        style={{ padding: '2em 0em', backgroundColor: 'black' }}
        vertical
      >
        <Grid container stackable verticalAlign="middle">
          <div className="m-8 m-auto flex w-full flex-1 text-center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className="flex-1 items-center justify-center self-center"
            >
              {' '}
              <Link to="/order/mars-ticket" style={{ color: 'white' }}>
                Book your space vacation now
              </Link>
            </Button>
          </div>
        </Grid>
      </Segment>
    </ResponsiveContainer>
  );
};
export default HomepageLayout;
