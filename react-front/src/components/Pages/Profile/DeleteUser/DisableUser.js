import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../../../Auth/Auth";
class DeleteUser extends Component {
  state = {
    redirect: false,
  };
  //===================================
  remove = (token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/users/deleteAccount`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //provides the current users jwt
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  signout = (next) => {
    //if the window is NOT empty
    if (typeof window !== "undefined") localStorage.removeItem("jwt");
    //redirects user by executing the middleware passed in
    next();
    return fetch(`${process.env.REACT_APP_API_URL}/api/auth/signout`, {
      method: "GET",
    })
      .then((response) => {
        // console.log("signout", response);
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    this.remove(userId,token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.signout(() => console.log("User is deleted"));
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-danger"
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
