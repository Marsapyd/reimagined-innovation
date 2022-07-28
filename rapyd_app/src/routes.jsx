import { Route, Routes } from 'react-router-dom';
import Hoc from './hoc/hoc';
import BookSpaceTravel from './components/BookTravel';
import Login from './containers/Login';
import Signup from './containers/Signup';
import HomepageLayout from './containers/Home';
import About from './containers/AboutUs';
import ContactUs from './containers/ContactUs';

const BaseRouter = () => (
  <Hoc>
    <Routes>
      <Route path="/" element={<HomepageLayout />} />
      <Route path="login" element={<Login />} />
      <Route path="about" element={<About />} />
      <Route path="signup" element={<Signup />} />
      <Route path="contact" element={<ContactUs />} />
      <Route path="/order/:pk" element={<BookSpaceTravel />} />
      <Route element={HomepageLayout} />
    </Routes>
  </Hoc>
);

export default BaseRouter;
