import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      redirectToSignIn: false,
    };
  }

  componentDidMount() {
    console.log("user id from route params: ", this.props.match.params.userId);
  }

  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <p>Hello {isAuthenticated().user.name}</p>
        <p>Email: {isAuthenticated().user.email}</p>
      </div>
    );
  }
}

export default Profile;