import React, {useState} from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authSignup } from "../store/actions/auth";

const RegistrationForm = (props) => {

  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(authSignup(username, email, password1, password2));
  };

    if (token) {
      return <Redirect to="/" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Signup to your account
          </Header>
          {error && <p>{error.message}</p>}

          <React.Fragment>
            <Form size="large" onSubmit={handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={e=>setUsername(e.target.value)}
                  value={username}
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                />
                <Form.Input
                  onChange={e=>setEmail(e.target.value)}
                  value={email}
                  name="email"
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address"
                />
                <Form.Input
                  onChange={e=>setPassword1(e.target.value)}
                  fluid
                  value={password1}
                  name="password1"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                <Form.Input
                  onChange={e=>setPassword2(e.target.value)}
                  fluid
                  value={password2}
                  name="password2"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirm password"
                  type="password"
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Signup
                </Button>
              </Segment>
            </Form>
            <Message>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }

export default RegistrationForm;
