import React, { useEffect, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch} from "react-redux";
import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import "semantic-ui-css/semantic.min.css";
import CustomLayout from "./containers/Layout";

function App(props) {
  const dispatch = useDispatch();

  const memoizedCallback = useCallback(
    () => {
      dispatch(actions.authCheckState())
    },
    [dispatch],
  )
  useEffect(()=> {
    memoizedCallback()
  }, [memoizedCallback])

    return (
      <Router>
        <CustomLayout {...props}>
          <BaseRouter />
        </CustomLayout>
      </Router>
    );
  }

export default App
