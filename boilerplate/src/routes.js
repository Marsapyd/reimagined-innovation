import React from "react";
import { Route, Switch} from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";

const BaseRouter = () => (
  <Hoc>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route exact path="/" component={HomepageLayout} />
        <Route component={HomepageLayout}/>
    </Switch>
  </Hoc>
);

export default BaseRouter;
