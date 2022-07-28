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
import Navbar from '../components/Navbar';
import FooterSection from '../assets/images/Footer.png';

const CustomLayout = ({ children }) => (
  <div className="bg-black">
    <Menu fixed="top" inverted>
      <Container>
        <Navbar />
      </Container>
    </Menu>
    <Segment style={{ padding: '2em 0em', backgroundColor: 'black' }} vertical>
      {children}
    </Segment>

    <Segment inverted vertical>
      <Grid divided inverted stackable style={{ marginBottom: '1em' }}>
        <img
          src={FooterSection}
          alt="footer-musk"
          className="
          bg-cover
          bg-center"
        />
      </Grid>
      <Container textAlign="center">
        <List horizontal inverted divided link size="small">
          <List.Item as="a" href="#">
            &copy; {new Date().getFullYear()} Copyright
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

CustomLayout.propTypes = {
  children: PropTypes.node.isRequired
};
export default CustomLayout;
