/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { authLogin } from '../store/actions/auth';

const LoginForm = () => {
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(authLogin(email, password));
    setEmail('');
    setPassword('');
  };
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);
  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Login to your account
        </Header>
        <p>{error}</p>
        <>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                onChange={e => setEmail(_ => e.target.value)}
                value={email}
                name="email"
                icon="user"
                iconPosition="left"
                placeholder="email"
              />
              <Form.Input
                onChange={e => setPassword(_ => e.target.value)}
                value={password}
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
              />
              <Button
                color="teal"
                fluid
                size="large"
                loading={loading}
                disabled={loading}
              >
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <NavLink to="/signup">Sign Up</NavLink>
          </Message>
        </>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
