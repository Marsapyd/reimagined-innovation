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
import PropTypes from 'prop-types';

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

const About = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: '2em 0em', backgroundColor: 'black' }} vertical>
      <Segment
        style={{ padding: '2em 0em', backgroundColor: 'black' }}
        vertical
      >
        <Grid container stackable verticalAlign="middle">
          <Typography
            variant="h5"
            color="white"
            sx={{ wordWrap: 'break-word', padding: '2em', lineHeight: '2' }}
          >
            This App seeks to solve some of the payment issues regarding space
            travel. In order to do this, Rapyd Virtual Accounts API will be
            used. The app seeks to conduct transactions internationally: as a
            result bank payments in the payer&apos;s local currency would be
            accepted. Lastly, there will be an initial deposit, after which the
            remaining amount can be paid off before the trip to space commences.
            We have various objectives of this app. They include the following:
          </Typography>
          <Typography
            variant="h5"
            color="white"
            sx={{ wordWrap: 'break-word', padding: '2em' }}
          >
            1. Incurring as low intercharge fees as possible.
          </Typography>
          <Typography
            variant="h5"
            color="white"
            sx={{ wordWrap: 'break-word', padding: '2em' }}
          >
            2. Ensuring a seemless transaction without any form of hassle or
            friction.
          </Typography>
          <Typography
            variant="h5"
            color="white"
            sx={{ wordWrap: 'break-word', padding: '2em' }}
          >
            3. Enabling international transfers to occur with convenience for
            the payer.
          </Typography>
          <Typography
            variant="h5"
            color="white"
            sx={{ wordWrap: 'break-word', padding: '2em' }}
          >
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged.
          </Typography>
          <Typography
            variant="h5"
            color="white"
            sx={{ wordWrap: 'break-word', padding: '2em' }}
          >
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Typography>
        </Grid>
      </Segment>
    </Segment>
  </ResponsiveContainer>
);
export default About;
