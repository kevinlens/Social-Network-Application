import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";

class ProfileAdmin extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignIn: false,
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.addIdHere;
    console.log(userId);
    fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //provides the current users jwt
        Authorization: `Bearer ${isAuthenticated().token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          //Log the error message
          console.log(data.error);
        } else {
          //set the state
          this.setState({ user: data.data });
          console.log(this.state.user);
        }
      });
  }

  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <p>{this.state.user.name}</p>
        <p>{this.state.user.email}</p>
        <p>{`Joined: ${new Date(this.state.user.created).toDateString()}`}</p>
      </div>
    );
  }
}

export default ProfileAdmin;
