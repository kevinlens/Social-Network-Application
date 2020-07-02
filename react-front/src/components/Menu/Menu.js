import React from "react";
/*You can get access to the history object’s properties 
via the withRouter higher-order component. withRouter will
pass updated match, location, and history props to the 
wrapped component */
/*Think of 'history location pathname' as the pages current path location*/
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated } from '../Auth/Auth';

const isActive = (history, path) => {
  return history.location.pathname === path
    ? { color: "#ff9900" }
    : { color: "#ffffff" };
};

export const signout = (next) => {
  //if the window is NOT empty
  if (typeof window !== "undefined") localStorage.removeItem("jwt");
  //redirects user by executing the middleware passed in
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

      {/* if 'isAuthenticated' is not true, then display */}
      {!isAuthenticated() && (
        //Fragments '<></>' let you group a list of children without adding extra nodes to the DOM.
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signup")}
              to="/signup"
            >
              Sign Up
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signin")}
              to="/signin"
            >
              Sign In
            </Link>
          </li>
        </>
      )}

      {/* if is not authenticated, meaning not signed in */}
      {isAuthenticated() && (
        //Fragments '<></>' let you group a list of children without adding extra nodes to the DOM.
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              //forces the path location to be '/'
              onClick={() => signout(() => history.push("/"))}
            >
              Sign Out
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to={`/user/${isAuthenticated().user._id}`}
              style={{ color: "#fff", textDecoration: "none" }}
              className="nav-link"
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>
        </>
      )}
    </ul>
  </section>
);

export default withRouter(Menu);
