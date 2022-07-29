import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Popover,
  MenuItem,
  Divider
} from '@mui/material';
import { useState, useMemo } from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { AccountCircle } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import countryList from 'react-select-country-list';
import ReactSelectMaterialUi from 'react-select-material-ui';
import { logout } from '../store/actions/auth';
import { getCountryUtil } from '../store/actions/auth';

const Navbar = () => {
  const authenticated = useSelector(state => state.auth.token !== null);
  const country = useSelector(state => state.auth.country);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState();

  const [value, setValue] = useState(country);
  const options = useMemo(() => countryList().getLabelList(), []);

  const changeHandler = countryAlpha => {
    setValue(countryAlpha);
    dispatch(getCountryUtil(countryAlpha));
  };
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const activeStyle = {
    color: 'b#757ce8'
  };
  const planeStyle = {
    color: 'white'
  };
  return (
    <div>
      <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
          >
            <NavLink
              to="/"
              style={({ isActive }) =>
                isActive
                  ? activeStyle
                  : {
                      color: 'red'
                    }
              }
            >
              <RocketLaunchIcon />
            </NavLink>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Touch the Sky
          </Typography>
          <ReactSelectMaterialUi
            placeholder={country}
            InputLabelProps={{
              sx: {
                color: 'white'
              }
            }}
            name="Countries"
            options={options}
            defaultValue="CA"
            value={value}
            className="bg-black text-black"
            sx={{
              backgroundColor: 'black',
              color: 'green',
              width: 60
            }}
            onChange={changeHandler}
          />

          <Stack direction="row" spacing={1}>
            <Button color="inherit">
              {' '}
              <NavLink
                to="/about"
                style={({ isActive }) => (isActive ? activeStyle : planeStyle)}
              >
                About Us
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                to="/contact"
                style={({ isActive }) => (isActive ? activeStyle : planeStyle)}
              >
                Contact Us
              </NavLink>
            </Button>
            <Button color="inherit">
              <NavLink
                to="/order/mars-ticket"
                style={({ isActive }) => (isActive ? activeStyle : planeStyle)}
              >
                Book Space Tourism ticket
              </NavLink>
            </Button>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="logo"
              aria-describedby={id}
              onClick={handleClick}
              variant="contained"
            >
              <AccountCircle />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
            >
              {authenticated ? (
                <MenuItem onClick={() => dispatch(logout())}>Logout</MenuItem>
              ) : (
                <div className="bg-pink-100">
                  <MenuItem sx={{ width: 100 }}>
                    <NavLink
                      to="/login"
                      style={({ isActive }) =>
                        isActive
                          ? activeStyle
                          : {
                              color: 'gray'
                            }
                      }
                    >
                      Login
                    </NavLink>
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ width: 100 }}>
                    <NavLink
                      to="/signup"
                      className="text-grey-700"
                      style={({ isActive }) =>
                        isActive
                          ? activeStyle
                          : {
                              color: 'gray'
                            }
                      }
                    >
                      Signup
                    </NavLink>
                  </MenuItem>
                </div>
              )}
            </Popover>
          </Stack>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
