import React from "react";
import { Link, withRouter} from "react-router-dom";

const isActive = (history, path) => {
    return (history.location.pathname === path) 
        ? {color: "#ff9900"}
        : {color: "#ffffff"};
}

const Menu = ({history}) => (
  <section>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link 
            className="nav-link" 
            style={isActive(history, "/")} 
            to="/"
        >Home</Link>
      </li>
      <li className="nav-item">
        <Link 
            className="nav-link" 
            style={isActive(history, "/signup")} 
            to="/signup"
        >Sign In</Link>
      </li>
      <li className="nav-item">
        <Link 
            className="nav-link" 
            style={isActive(history, "/signin")} 
            to="/signin"
        >Sign Up</Link>
      </li>
    </ul>
  </section>
);

export default withRouter(Menu);
