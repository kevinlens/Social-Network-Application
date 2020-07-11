import React, { Component } from "react";
import { isAuthenticated } from "../../../Auth/Auth";

const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      //provides the current users jwt
      Authorization: `Bearer ${token}`,
    },
  });
};

const signout = (next) => {
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

class DeleteUser extends Component {
  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;
    remove(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        signout(() => console.log("User is deleted"));
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
