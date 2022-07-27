import { Route, Routes } from 'react-router-dom';
import Hoc from './hoc/hoc';

import Login from './containers/Login';
import Signup from './containers/Signup';
import HomepageLayout from './containers/Home';

const BaseRouter = () => (
  <Hoc>
    <Routes>
      <Route path="/" element={<HomepageLayout />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route element={HomepageLayout} />
    </Routes>
  </Hoc>
);

export default BaseRouter;
