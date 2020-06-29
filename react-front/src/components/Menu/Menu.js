import React from "react";
/*You can get access to the history object’s properties 
via the withRouter higher-order component. withRouter will
pass updated match, location, and history props to the 
wrapped component */
import { Link, withRouter } from "react-router-dom";

const isActive = (history, path) => {
  return history.location.pathname === path
    ? { color: "#ff9900" }
    : { color: "#ffffff" };
};

export const signout = (next) => {
  //if the window is NOT empty
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  //redirects user
  next();
  return fetch("http://localhost:8080/api/auth/signout", {
    method: "GET",
  })
    .then((response) => {
      console.log("signout", response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

const Menu = ({ history }) => (
  <section>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/signup")}
          to="/signup"
        >
          Sign In
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/signin")}
          to="/signin"
        >
          Sign Up
        </Link>
      </li>
      <li>
        <a className="nav-link" style={isActive(histroy, "/signup")}>
          Sign Out
        </a>
      </li>
    </ul>
  </section>
);

export default withRouter(Menu);
