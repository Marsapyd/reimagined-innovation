import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CardHeader,
  Box,
  TextField
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllInfoByISO } from 'iso-country-currency';
import RedPlanet from '../assets/images/space-ticket-image.png';
import { setAmount } from '../store/actions/auth';
import { numberWithCommas } from './utils';

function BookSpaceTravel() {
  const navigate = useNavigate();
  const amount = useSelector(state => state.auth.amount);
  const dispatch = useDispatch();
  const country = useSelector(state => state.auth.country);
  const [currency, setCurrency] = useState('');
  const [rates, setRates] = useState([]);
  const baseAmount = 150000;
  useEffect(() => {
    axios
      .get(
        'https://openexchangerates.org/api/latest.json?app_id=cf5b21d711aa406a84eb3d9d688559af&base=USD'
      )
      .then(response => {
        setRates(response.data.rates);
      });
  }, []);
  useEffect(() => {
    if (country) {
      const currData = getAllInfoByISO(country);
      setCurrency(currData.symbol);
      dispatch(setAmount(Math.round(rates[currData.currency] * baseAmount)));
    } else {
      setCurrency(getAllInfoByISO('US').symbol);
    }
  }, [country, rates, baseAmount, dispatch]);
  const formik = useFormik({
    initialValues: {
      ticketQuantity: 1
    },
    onSubmit: ({ ticketQuantity }) => {
      const state = {
        amount: amount * ticketQuantity,
        ticketQuantity,
        itemName: 'space-ticket-to-mars'
      };
      navigate('/checkout', { state });
    }
  });
  return (
    <div className="mx-auto my-32 flex w-9/12 self-center text-white">
      <Card
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid container spacing={1} columns={2}>
          <Grid item xs={1} style={{ marginBottom: '1em', color: 'white' }}>
            <CardHeader
              title={
                <Typography gutterBottom variant="h5">
                  This year&apos;s destination: The Red Planet
                </Typography>
              }
              subheader={
                <Typography gutterBottom variant="h7" className="text-gray-200">
                  Flight Date: August 15, 2022
                </Typography>
              }
            />
            <CardContent>
              <img
                src={RedPlanet}
                alt="footer-musk"
                className="
          bg-cover
          bg-center"
              />
            </CardContent>
          </Grid>
          <Grid item xs={1} style={{ marginBottom: '1em', color: 'white' }}>
            <CardHeader
              title={
                <Box className="flex flex-row">
                  <Typography gutterBottom variant="h5">
                    Mars -
                  </Typography>
                  <Typography variant="h5"> The Red Planet</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box className="flex flex-row items-center justify-between">
                <Box className="flex flex-col">
                  <Typography
                    gutterBottom
                    variant="h6"
                    className="text-gray-300"
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sequi quae provident, eveniet odio magnam accusantium.
                    Possimus nam fugiat maiores ipsum recusandae et repellat
                    adipisci voluptatum doloribus? Pariatur tempore iste soluta?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Corrupti, dignissimos nihil? Voluptatibus consectetur non
                    molestias illo dicta dignissimos, hic eum, eos qui in,
                    distinctio ipsa porro? Fuga maiores laudantium voluptatem?
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Box className="flex flex-row items-center justify-between">
                <Box className="flex flex-col">
                  <Typography
                    gutterBottom
                    variant="h7"
                    className="text-gray-500"
                  >
                    Distance From Earth
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h4"
                    className="text-gray-200"
                  >
                    62,570,049 <span className="text-lg">km</span>
                  </Typography>
                </Box>
                <Box className="flex flex-col">
                  <Typography
                    gutterBottom
                    variant="h7"
                    className="text-gray-500"
                  >
                    Price
                  </Typography>
                  <Typography
                    color="orange"
                    gutterBottom
                    variant="h4"
                    className="text-gray-200"
                  >
                    {currency}
                    {numberWithCommas(amount)}
                    <span className="text-lg"> per person</span>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <Box className="items-between flex flex-col items-center">
                  <TextField
                    label="Ticket quantity"
                    InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        borderColor: 'green',
                        border: '3em',
                        overflow: 'hidden',
                        width: '100%',
                        color: 'green',
                        fontSize: 20
                      }
                    }}
                    placeholder="How many tickets"
                    variant="filled"
                    type="number"
                    name="ticketQuantity"
                    value={formik.values.ticketQuantity}
                    onChange={formik.handleChange}
                    fullWidth
                    required
                    className="top-1.5 border-red-700"
                    color="secondary"
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      style: {
                        textOverflow: 'ellipsis',
                        borderColor: 'green !important',
                        border: '3em',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        color: 'green',
                        fontSize: 30
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    align="center"
                    fullWidth
                    sx={{ marginTop: '2em' }}
                  >
                    Add To Cart
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}

export default BookSpaceTravel;
