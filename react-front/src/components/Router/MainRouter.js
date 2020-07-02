import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Menu from "../Menu/Menu";
import Signup from "../Pages/Signup/Signup";
import Signin from "../Pages/Signin/Signin";
import Profile from "../Pages/Profile/Profile";

const MainRouter = () => (
  <section>
    <Menu />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/user/:userId" component={Profile} />
    </Switch>
  </section>
);

export default MainRouter;
