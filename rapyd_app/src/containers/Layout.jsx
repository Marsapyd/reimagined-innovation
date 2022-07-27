import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Divider,
  Grid,
  Header,
  List,
  Menu,
  Segment
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/actions/auth';

const CustomLayout = ({ children }) => {
  const authenticated = useSelector(state => state.auth.token !== null);
  const dispatch = useDispatch();
  return (
    <div>
      <Menu fixed="top" inverted>
        <Container>
          <Link to="/">
            <Menu.Item header>Home</Menu.Item>
          </Link>
          {authenticated ? (
            <Menu.Item header onClick={() => dispatch(logout())}>
              Logout
            </Menu.Item>
          ) : (
            <>
              <Link to="/login">
                <Menu.Item header>Login</Menu.Item>
              </Link>
              <Link to="/signup">
                <Menu.Item header>Signup</Menu.Item>
              </Link>
            </>
          )}
        </Container>
      </Menu>

      {children}

      <Segment
        inverted
        vertical
        style={{ margin: '5em 0em 0em', padding: '5em 0em' }}
      >
        <Container textAlign="center">
          <Grid divided inverted stackable>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Group 1" />
              <List link inverted>
                <List.Item as="a">Link One</List.Item>
                <List.Item as="a">Link Two</List.Item>
                <List.Item as="a">Link Three</List.Item>
                <List.Item as="a">Link Four</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Group 2" />
              <List link inverted>
                <List.Item as="a">Link One</List.Item>
                <List.Item as="a">Link Two</List.Item>
                <List.Item as="a">Link Three</List.Item>
                <List.Item as="a">Link Four</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Group 3" />
              <List link inverted>
                <List.Item as="a">Link One</List.Item>
                <List.Item as="a">Link Two</List.Item>
                <List.Item as="a">Link Three</List.Item>
                <List.Item as="a">Link Four</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header inverted as="h4" content="Footer Header" />
              <p>
                Extra space for a call to action inside the footer that could
                help re-engage users.
              </p>
            </Grid.Column>
          </Grid>

          <Divider inverted section />
          <List horizontal inverted divided link size="small">
            <List.Item as="a" href="#">
              Site Map
            </List.Item>
            <List.Item as="a" href="#">
              Contact Us
            </List.Item>
            <List.Item as="a" href="#">
              Terms and Conditions
            </List.Item>
            <List.Item as="a" href="#">
              Privacy Policy
            </List.Item>
          </List>
        </Container>
      </Segment>
    </div>
  );
};

CustomLayout.propTypes = {
  children: PropTypes.node.isRequired
};
export default CustomLayout;
