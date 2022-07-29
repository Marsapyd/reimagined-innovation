import { useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BaseRouter from './routes';
import * as actions from './store/actions/auth';
import 'semantic-ui-css/semantic.min.css';
import CustomLayout from './containers/Layout';

function App() {
  const dispatch = useDispatch();
  const amount = useSelector(state => state.auth.amount);
  const memoizedCallback = useCallback(() => {
    dispatch(actions.authCheckState());
    dispatch(actions.getCountry(amount));
  }, [dispatch]);
  useEffect(() => {
    memoizedCallback();
  }, [memoizedCallback]);

  return (
    <Router>
      <CustomLayout>
        <BaseRouter />
      </CustomLayout>
    </Router>
  );
}

export default App;
