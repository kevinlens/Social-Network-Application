import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Menu from "../Menu/Menu";
import Signup from "../Pages/Signup/Signup";
import Signin from "../Pages/Signin/Signin";
import Profile from "../Pages/Profile/Profile";
import ProfileAdmin from "../Pages/Profile/Admin";
import Users from '../Pages/Users/Users'

const MainRouter = () => (
  <section>
    <Menu />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      {/* when there is same path like '/user/' you have to be very careful */}
      <Route path="/user/myAccount" component={Profile} />
      <Route exact path="/users/:addIdHere" component={ProfileAdmin} />

    </Switch>
  </section>
);

export default MainRouter;
