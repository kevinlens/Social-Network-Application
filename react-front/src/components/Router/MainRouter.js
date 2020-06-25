import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../Home/Home";
import Signup from "../User/Signup"

const MainRouter = () => (
  <section>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={Signup} />
    </Switch>
  </section>
);

export default MainRouter