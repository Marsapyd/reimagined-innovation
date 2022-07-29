import { Typography, Card, Grid, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';

function ContactUs() {
  const [formData, setFormData] = useState('');
  const [sent, setSent] = useState(false);
  const initialState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: ''
  };
  const formik = useFormik({
    initialValues: initialState,
    onSubmit: (values, { resetForm }) => {
      setFormData(JSON.stringify(values));
      resetForm({
        values: initialState
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
      }, 20000);
    }
  });
  return (
    <div className="CheckoutForm m-8">
      <Typography
        gutterBottom
        variant="h4"
        textAlign="center"
        color="white"
        sx={{ marginTop: '8em 4em', padding: '20px 5px' }}
      >
        How Can we Help?
      </Typography>
      <Card>
        {sent ? (
          <div
            id="form-message-success"
            className="mb-4 text-center text-xl text-red-700"
          >
            Your message was sent successfully, thank you!
          </div>
        ) : null}

        <form onSubmit={formik.handleSubmit}>
          <Grid container>
            <TextField
              id="Name"
              label="First Name"
              placeholder="Enter your first name"
              variant="filled"
              name="first_name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              fullWidth
              required
            />
            <TextField
              id="Surname"
              label="Last Name"
              placeholder="Enter your surname"
              variant="filled"
              name="last_name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              fullWidth
              required
            />
            <TextField
              id="email"
              label="Email Address"
              placeholder="Enter your Email address"
              variant="filled"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              fullWidth
              required
            />

            <TextField
              id="phone"
              label="Phone Number"
              placeholder="Enter your Phone Number"
              variant="filled"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              fullWidth
              required
            />

            <TextField
              label="Message"
              placeholder="Enter your message"
              variant="filled"
              name="message"
              multiline
              rows={4}
              value={formik.values.message}
              onChange={formik.handleChange}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              align="center"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </form>
      </Card>
    </div>
  );
}

export default ContactUs;
