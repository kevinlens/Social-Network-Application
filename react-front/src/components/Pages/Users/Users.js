import React, { Component } from "react";
import { isAuthenticated } from "../../Auth/Auth";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
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
            console.log(data)
        } else {
          console.log(data);
        }
      });
  }
  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
      </div>
    );
  }
}
export default Users;
