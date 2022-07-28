import { useState } from 'react';
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
import { useFormik } from 'formik';
import RedPlanet from '../assets/images/space-ticket-image.png';

function BookSpaceTravel() {
  const [tickets, seTickets] = useState(0);
  const formik = useFormik({
    initialValues: {
      ticketQuantiy: 0
    },
    onSubmit: values => {
      console.log(JSON.stringify(values));
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
          <Grid
            divided
            item
            xs={1}
            inverted
            stackable
            style={{ marginBottom: '1em', color: 'white' }}
          >
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
          <Grid
            divided
            item
            xs={1}
            inverted
            stackable
            style={{ marginBottom: '1em', color: 'white' }}
          >
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
                    $150, 000 <span className="text-lg">per person</span>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardContent>
              <Box className="flex flex-row items-center justify-between">
                <Box className="flex flex-col">
                  <TextField
                    label="Ticket quantity"
                    placeholder="How many tickets"
                    variant="filled"
                    name="ticket_quantity"
                    value={formik.values.ticket_quantity}
                    onChange={formik.handleChange}
                    fullWidth
                    required
                    className="bg-red"
                    color="secondary"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    sx={{
                      backgroundColor: 'redxs'
                    }}
                  />
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
                    $150, 000 <span className="text-lg">per person</span>
                  </Typography>
                </Box>
              </Box>
            </CardContent>

            <Grid xs={12} item>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                align="center"
                fullWidth
                onClick={() => console.log('Submitted')}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}

export default BookSpaceTravel;
