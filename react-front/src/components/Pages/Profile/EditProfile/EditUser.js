import React, { Component } from "react";
import { isAuthenticated } from "../../../Auth/Auth";

class EditUser extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
    };
  }

  //

  init = (userId) => {
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
          this.setState({ error: data.error });
        } else {
          //set the state
          this.setState({
            id: data.data._id,
            name: data.data.name,
            email: data.data.email,
          });
        }
      });
  };

  //

  //

  // allows admin to search for any user through their users by putting in the url
  componentDidMount() {
    const userId = this.props.match.params.addIdHere;
    //
    this.init(userId);
  }

  //

  render() {
    return (
      <section className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
      </section>
    );
  }
}

export default EditUser;
