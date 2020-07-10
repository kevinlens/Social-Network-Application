import React from "react";
/*You can get access to the history object’s properties 
via the withRouter higher-order component. withRouter will
pass updated match, location, and history props to the 
wrapped component */
/*Think of 'history location pathname' as the pages current path location*/
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "../Auth/Auth";

const isActive = (history, path) => {
  return history.location.pathname === path
    ? { color: "#ff9900" }
    : { color: "#ffffff" };
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
              style={isActive(history, "/users")}
              to="/users"
            >
              Users
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              //forces the path location to be '/'
              onClick={() => signout(() => history.push("/"))}
              to="/"
            >
              Sign Out
            </Link>
          </li>
          {/* PROFILE */}
          <li className="nav-item">
            {/* if user is admin */}
            {isAuthenticated().user.role === "admin" ? (
              <Link
                to={`/users/:addIdHere`}
                style={isActive(history, "/user/:addIdHere")}
                className="nav-link"
              >
                {`Targetted User's profile`}
              </Link>
            ) : (
              <Link
                to={`/user/myAccount`}
                style={{ color: "#fff", textDecoration: "none" }}
                className="nav-link"
              >
                {`${isAuthenticated().user.name}'s profile`}
              </Link>
            )}
          </li>
        </>
      )}
    </ul>
  </section>
);

export default withRouter(Menu);
